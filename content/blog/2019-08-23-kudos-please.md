+++
title = "Kudos Please!"
description = "A journey into serverless architecture!"

[taxonomies]
tags = ["website"]
+++

You may have noticed a small UI element like the following on each of my posts on this website.

{{ figure(src="/blog/kudos-please-snippet.png", caption="The UI element in question.") }}

This is a simple way of you, the reader, giving some recognition that you (hopefully) enjoyed a particular blog post. Simply hover over the element and observe the element animate and change! Keep your mouse/finger on the element for long enough and.. aha! The number of kudos has increased.

The basis for this feature is the hard work of [Tim Pietrusky](https://github.com/TimPietrusky) and their [original implementation](http://kudosplease.com/). The CSS and Javascript backing the changes you observed earlier has been entirely lifted from their repository.

So why did I not use the feature outright, as the website suggests that I could?

The simple reason is [**Mixed Active Content**](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_active_content). This security measure prevents pages secured with TLS(SSL) from making requests to unsecured pages. Unfortunately, the original backend is not secured with TLS (`http://www.api.kudosplease.com`), whereas this page is! 

This meant that if I wanted to add this feature to my website, I'd need to provide an alternate backend implementation was _was_ secured with TLS. 

## The Requirements

Before writing this backend and selecting a technology, I needed to enumerate the (simple) requirements:

- Must be secured with TLS to comply with the Mixed Active Content rules.
- Data must be persistent across sessions. If a user gives kudos this should increment the count for all future users.
- API requests should be relatively quick to process. Lets say a maximum of 500ms roundtrip. Since I can update the kudos asynchronously from the page loading, this doesn't require the fastest response times, but should still be timely.

There are also some softer requirements/nice-to-haves:

- Free and/or cheap. At the time of writing, I only pay for the domain for this website. It is hosted with [Netlify](https://www.netlify.com/) on the free tier.
- Quick to update/deploy changes. Although I don't anticipate changing the backend APIs frequently, it should still be easy to update.

## Choosing the tech

### Standalone web server

My first thought was to host a tiny (very tiny) web server to host the API and a small database local on that machine to store the persistent data. I could host this web server at something like: 
`https://api.jamiebrynes.com` which also gives me the option of extending and adding additional API endpoints to this web server in the future.

However this opens up many questions. Where do I host this small machine? How to handle database backups/restores? How do I deploy to this machine?

I'd also have to deal with adding an SSL certificate to this subdomain as well (thankfully [LetsEncrypt](https://letsencrypt.org/) makes this somewhat trivial).

For such a small API, this seemed like overkill and an excessive amount of engineering effort.

### Serverless

So I turned to the in-vogue buzz word: **serverless**. There are a ton of choices for serverless compute providers: [AWS Lambda](https://aws.amazon.com/lambda/), [Google Cloud Functions](https://cloud.google.com/functions/), [Azure Functions](https://azure.microsoft.com/en-gb/services/functions/), [zeit.co](https://zeit.co/docs/v2/advanced/concepts/lambdas), and probably many more. 

If using serverless compute, it would make sense to also use cloud services to store permanent data. Why bother with the hosting and management of a database myself? Again there are a myriad of choices on a variety of providers like GCP or AWS. It would also make sense to co-locate services so minimize complexity (i.e. - if using AWS Lambda, use an AWS database service).

To enumerate _some_ of the options in table form:

| Provider |     Compute     |               Database               |                         Cost? |
|----------|:---------------:|:------------------------------------:|------------------------------:|
| AWS      |     Lambda      |        Aurora, RDS, DynamoDB         |  Free tier, if using DynamoDB |
| GCP      | Cloud Functions | Cloud Firestore,  Cloud SQL, Spanner | Free tier, if using Firestore |
| Azure    | Azure Functions |     PostgreSQL, MySQL, Cosmos DB     |  Free for 12 months, then pay |

Given my proclivity for free services, this led to to look at AWS and GCP a little closer. In the end, I have used AWS Lambda a _little_ bit in the past and this was enough to sway me that way. (This also means I was using DynamoDB since it was free too!)

## Designing the API

### Requests and responses

The original API call used by kudos please uses the following scheme for its API:

- `GET http://api.kudos-please.com/?url=<url>` to fetch current kudos
- `POST http://api.kudos-please.com/?url=<url>` to increment kudos

To imitate this API call, I'd need to put an API Gateway in front of the Lambda function. This would give me the HTTP verbs as well as HTTPS to boot!

I settled for the non-RESTful scheme of using the same API endpoint for fetching and incrementing and passing data in the body as JSON. This tradeoff would allow me to have a very simple API Gateway configuration.

To fetch kudos: 

```
POST https://my-lambda-api.aws.com

body: 
{
    "url": <url>,
    "increment": false
}
```

Similarly to increment kudos:

```
POST https://my-lambda-api.aws.com

body: 
{
    "url": <url>,
    "increment": true
}
```

This would return a simple response: 

```
code: 200
body: 
{
    "value": 10
}
```

### Writing the lambda

AWS Lambda offers a huge amount of languages and SDKs for its services. It natively supports Java, Go, PowerShell, Node.js, C#, Python, and Ruby in additional to providing a Runtime API which allow you to use additional language.

The latter point caught my eye and I had a quick search for a SDK in my favorite langauge du jour, **Rust**. My search was not in vain and turned up a [great libray from `awslabs`](https://github.com/awslabs/aws-lambda-rust-runtime). However, this wasn't the only piece to the puzzle. I'd need to also interact with DynamoDB, but again a quick search turned up [Rustoso](https://github.com/rusoto/rusoto).

With these tools and trusty libraries like [serde](https://github.com/serde-rs/serde), I was ready to get started! What follows isn't a tutorial, but a breakdown of the code and calling out some of the more interesting parts. You can find the [complete lambda function source here](https://github.com/jamiebrynes7/website/blob/master/kudos/src/main.rs).

First things first, lets define some boilerplate: 

```rust
use lambda_runtime::error::HandlerError;
use lambda_runtime::lambda;
use lambda_runtime::Context;

fn main() -> Result<(), Box<dyn Error>> {
    lambda!(kudos_handler);
    Ok(())
}

fn kudos_handler(event: KudosRequest, _ctx: Context) -> Result<KudosResponse, HandlerError> {
    ...
}
```

This defines the entrypoint to your lambda function. The handy `lambda!` macro operates as the bridge between the lambda runtime and your code. This code effective says: "When a lambda gets triggered, run `kudos_handler`.

Now lets define our data format that will be used to send/recv data: 

```rust
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

// Custom JSON serializer to parse the stringified JSON in the body of the request.
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
} 
```

That last `deserialize_json_string` function is a little helper that will deserialize the stringified JSON from the body into the `KudosEvent` struct. We could do something similar with a `#[serde(serialize_with)]` macro for the response, but I wanted to test out both methods to see how they felt. You'll see the impact of this later.

Now we can get onto handling the fetch requests: 

```rust
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
```

This uses the Rustoso library to query DynamoDB given a url. The way DynamoDB handles a query is that all parameters are encoded as strings, so you specify the type as part of the `AttributeValue`. For example: 

```rust
query_key.insert(
        "url".to_string(),
        AttributeValue {
            s: Some(url.to_string()),
            ..Default::default()
        },
    );
```

This defines a query on the `url` column of the table. It compares the value against a string (the `s` field in `AttributeValue`).

Handling increment requests are a little trickier, we do want to handle the case where multiple users try to give kudos at the same time (oh to be so popular!). Luckily, DynamoDB provides an atomic increment operator. When updating the item, you would use an expression like `SET kudos = kudos + :incr` where `:incr` is the increment amount.

For completeness, the increment function looks like: 

```rust
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
```

You'll note the `if_not_exists()` in the `update_expression`. This effectively says insert a default value if the key doesn't exist. This would be analagous to the [`or_insert` API](https://doc.rust-lang.org/std/collections/hash_map/enum.Entry.html#method.or_insert) on Rust's entry struct.

## Setting up AWS

The rest of the work required to get this API up and running is just some AWS configuration. To cut a long story short: 

1. Create a new DynamoDB table called `kudos-please`.
2. Create a new Lambda which can read/write to DynamoDB.
3. Add an API Gateway on the Lambda and enable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on it.
4. Test the API endpoint.

## The results

Let's return to the requirements and evaluate how we fared:

- Must be secured with TLS to comply with the Mixed Active Content rules. ✅
- Data must be persistent across sessions. ✅
- API requests should be relatively quick to process. ❓

To answer that final question, lets fall back onto our trusty Chrome Dev Tools.

{{ lightbox(src="/blog/kudos-please-benchmark.png", caption="A quick benchmark of fetching data on page load.") }}

{{ lightbox(src="/blog/kudos-please-benchmark-increment.png", caption="A quick benchmark of giving kudos.") }}

I think both these request/response times are well within the acceptable range. Particularly given that I put no time in optimizing the lambda code. You can notice the kudos initially loading on a page if you look quick enough, but its not a huge problem for the UX.

As for the nice-to-haves:

- Free and/or cheap. ✅
- Quick to update/deploy changes. ✅<sup>With some effort!</sup>

Ultimately, I was able to quickly implement, test, and deploy an alternative backend for the kudos please service using AWS for compute and data persistence! I consider this an absolute win.