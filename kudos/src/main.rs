use lambda_runtime::error::HandlerError;
use lambda_runtime::lambda;
use lambda_runtime::Context;
use rusoto_core::Region;
use rusoto_dynamodb::{AttributeValue, DynamoDb, DynamoDbClient, GetItemInput, UpdateItemInput};
use serde::{Deserialize, Serialize, de};
use std::collections::HashMap;
use std::error::Error;
use std::fmt;
use serde_json;

pub type Handler<E, O> = fn(E, Context) -> Result<O, HandlerError>;

#[derive(Serialize, Deserialize, Debug)]
struct KudosEvent {
    url: String,
    increment: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct KudosRequest {
    #[serde(deserialize_with = "deserialize_json_string")]
    body: KudosEvent
}

fn deserialize_json_string<'de, D>(deserializer: D) -> Result<KudosEvent, D::Error>
    where
        D: de::Deserializer<'de>,
{
    struct JsonStringVisitor;

    impl<'de> de::Visitor<'de> for JsonStringVisitor {
        type Value = KudosEvent;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("a string containing json data")
        }

        fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
        {
            serde_json::from_str(v).map_err(E::custom)
        }
    }

    deserializer.deserialize_any(JsonStringVisitor)
}

#[derive(Serialize, Deserialize, Debug)]
struct KudosResponseBody {
    value: u32,
}

#[derive(Serialize, Deserialize, Debug)]
struct KudosResponse {
    #[serde(rename(serialize = "statusCode"))]
    status_code: u32,
    body: String,
    headers: HashMap<String, String>
}

fn main() -> Result<(), Box<dyn Error>> {
    lambda!(kudos_handler);
    Ok(())
}

fn kudos_handler(event: KudosRequest, _ctx: Context) -> Result<KudosResponse, HandlerError> {
    let event = event.body;

    let mut headers = HashMap::new();
    headers.insert("Access-Control-Allow-Origin".to_string(), "*".to_string());

    if event.increment {
        increment_kudos(&event.url)
            .map(|value| KudosResponse {
                status_code: 200,
                body: serde_json::to_string(&KudosResponseBody {
                    value
                }).unwrap(),
                headers
            })
            .map_err(|e| HandlerError::from(e.to_string().as_str()))
    } else {
        get_current_kudos(&event.url)
            .map(|value| KudosResponse {
                status_code: 200,
                body: serde_json::to_string(&KudosResponseBody {
                    value
                }).unwrap(),
                headers
            })
            .map_err(|e| HandlerError::from(e.to_string().as_str()))
    }
}

fn get_current_kudos(url: &str) -> Result<u32, Box<dyn Error>> {
    let mut query_key = HashMap::new();
    query_key.insert(
        "url".to_string(),
        AttributeValue {
            s: Some(url.to_string()),
            ..Default::default()
        },
    );

    let query = GetItemInput {
        table_name: "kudos-please".to_string(),
        key: query_key,
        ..Default::default()
    };

    let client = DynamoDbClient::new(Region::EuWest2);

    let value = match client.get_item(query).sync() {
        Ok(result) => match result.item {
            Some(data) => match data.get("kudos").map_or(None, |attr| attr.n.clone()) {
                Some(number) => number.parse::<u32>()?,
                None => 0,
            },
            None => 0,
        },
        Err(e) => Err(format!("Failed to fetch item {:?}", e))?,
    };

    Ok(value)
}

fn increment_kudos(url: &str) -> Result<u32, Box<dyn Error>> {
    let mut query_key = HashMap::new();
    query_key.insert(
        "url".to_string(),
        AttributeValue {
            s: Some(url.to_string()),
            ..Default::default()
        },
    );

    let mut expression_attr_values = HashMap::new();
    expression_attr_values.insert(
        ":incr".to_string(),
        AttributeValue {
            n: Some("1".to_string()),
            ..Default::default()
        }
    );
    expression_attr_values.insert(
        ":zero".to_string(),
        AttributeValue {
            n: Some("0".to_string()),
            ..Default::default()
        }
    );

    let mut expression_attr_names = HashMap::new();
    expression_attr_names.insert("#kudos".to_string(), "kudos".to_string());

    let operation = UpdateItemInput {
        table_name: "kudos-please".to_string(),
        key: query_key,
        update_expression: Some("SET #kudos = if_not_exists(#kudos, :zero) + :incr".to_string()),
        return_values: Some("UPDATED_NEW".to_string()),
        expression_attribute_values: Some(expression_attr_values),
        expression_attribute_names: Some(expression_attr_names),
        ..Default::default()
    };

    let client = DynamoDbClient::new(Region::EuWest2);

    let value = match client.update_item(operation).sync() {
        Ok(result) => {
            match result.attributes {
                Some(attrs) => {
                    match attrs.get("kudos").map_or(None, |attr| attr.n.clone()) {
                        Some(n ) => n.parse::<u32>()?,
                        None => 0
                    }
                },
                None => Err("No kudos element found.".to_string())?
            }
        },
        Err(e) => Err(format!("Failed to update item {:?}", e))?,
    };

    Ok(value)
}
