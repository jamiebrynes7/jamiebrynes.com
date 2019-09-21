mod events;
use lambda_runtime::error::HandlerError;
use lambda_runtime::lambda;
use lambda_runtime::Context;
use rusoto_core::Region;
use rusoto_dynamodb::{AttributeValue, DynamoDb, DynamoDbClient, GetItemInput, UpdateItemInput};
use std::collections::HashMap;
use std::error::Error;
use crate::events::*;

#[cfg(test)]
mod tests;

pub type Handler<E, O> = fn(E, Context) -> Result<O, HandlerError>;

fn main() -> Result<(), Box<dyn Error>> {
    lambda!(entrypoint);
    Ok(())
}

fn entrypoint(event: KudosRequest, _ctx: Context) -> Result<KudosResponse, HandlerError> {
    kudos_handler(event, DynamoDbClient::new(Region::EuWest2))
}

fn kudos_handler<T: DynamoDb>(event: KudosRequest, client: T) -> Result<KudosResponse, HandlerError> {
    let event_body = event.body;

    let result = if event_body.increment {
        increment_kudos(&event_body.url, client)
    } else {
        get_current_kudos(&event_body.url, client)
    };

    let mut headers = HashMap::new();
    headers.insert("Access-Control-Allow-Origin".to_string(), "*".to_string());

    result
        .map(|value| KudosResponse::success(value, headers))
        .map_err(|e| HandlerError::from(e.to_string().as_str()))
}

fn get_current_kudos<T: DynamoDb>(url: &str, client: T) -> Result<u32, Box<dyn Error>> {
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

fn increment_kudos<T: DynamoDb>(url: &str, client: T) -> Result<u32, Box<dyn Error>> {
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
