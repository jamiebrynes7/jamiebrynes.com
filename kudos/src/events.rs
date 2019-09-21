use serde::{Deserialize, Serialize, de};
use std::fmt;
use serde_json;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct KudosEvent {
    pub url: String,
    pub increment: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KudosRequest {
    #[serde(deserialize_with = "deserialize_json_string")]
    pub body: KudosEvent
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
pub struct KudosResponseBody {
    value: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KudosResponse {
    #[serde(rename(serialize = "statusCode"))]
    status_code: u32,
    body: String,
    headers: HashMap<String, String>
}

impl KudosResponse {
    pub fn success(value: u32, headers: HashMap<String, String>) -> Self {
        KudosResponse {
            status_code: 200,
            body: serde_json::to_string(&KudosResponseBody {
                value
            }).unwrap(),
            headers
        }
    }
}