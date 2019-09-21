use rusoto_dynamodb::*;
use rusoto_core::{RusotoFuture, RusotoError};

use crate::{kudos_handler, get_current_kudos, increment_kudos};
use std::collections::HashMap;
use crate::events::{KudosRequest, KudosEvent};

const URL: &'static str = "some_url";

#[test]
pub fn kudos_handler_redirects_to_correct_func() {
    /* ---------------------- Get Item  ---------------------- */
    let mut mock = DynamoDbMock::default();

    let output = GetItemOutput {
        consumed_capacity: None,
        item: None
    };

    mock.expect_get_item(|_| true, Ok(output));

    let req = KudosRequest {
        body: KudosEvent {
            increment: false,
            url: URL.to_string()
        }
    };

    let res = kudos_handler(req, mock);
    assert!(res.is_ok());

    /* ---------------------- Update Item  ---------------------- */
    let mut mock = DynamoDbMock::default();

    let mut data = HashMap::new();

    data.insert("kudos".to_string(), AttributeValue {
        n: Some("1".to_string()),
        ..Default::default()
    });

    let output = UpdateItemOutput {
        consumed_capacity: None,
        attributes: Some(data),
        item_collection_metrics: None
    };

    mock.expect_update_item(|_| true, Ok(output));

    let req = KudosRequest {
        body: KudosEvent {
            increment: true,
            url: URL.to_string()
        }
    };

    let res = kudos_handler(req, mock);
    assert!(res.is_ok());
}

#[test]
pub fn kudos_handler_sets_error_code_and_headers() {
    let mut mock = DynamoDbMock::default();

    let output = GetItemOutput {
        consumed_capacity: None,
        item: None
    };

    mock.expect_get_item(|_| true, Ok(output));

    let req = KudosRequest {
        body: KudosEvent {
            increment: false,
            url: URL.to_string()
        }
    };

    let res = kudos_handler(req, mock);
    assert!(res.is_ok());

    let response = res.unwrap();
    assert_eq!(200, response.status_code);
    assert!(response.headers.get("Access-Control-Allow-Origin").map_or(false, |v| v.eq("*")));
}

#[test]
pub fn get_current_kudos_returns_current_kudos() {
    let mut mock = DynamoDbMock::default();

    let mut data = HashMap::new();
    data.insert("kudos".to_string(), AttributeValue {
        n: Some("1".to_string()),
        ..Default::default()
    });

    let output = GetItemOutput {
        consumed_capacity: None,
        item: Some(data)
    };

    mock.expect_get_item(validate_get_item, Ok(output));

    let result = get_current_kudos(URL, mock);
    assert!(result.is_ok());
    assert_eq!(1, result.unwrap());
}

#[test]
pub fn get_current_kudos_returns_0_if_url_does_not_exist() {
    let mut mock = DynamoDbMock::default();

    let output = GetItemOutput {
        consumed_capacity: None,
        item: Some(HashMap::new())
    };

    mock.expect_get_item(validate_get_item, Ok(output));

    let result = get_current_kudos(URL, mock);
    assert!(result.is_ok());
    assert_eq!(0, result.unwrap());
}

#[test]
pub fn get_current_kudos_errors_if_dynamo_db_errors() {
    let mut mock = DynamoDbMock::default();
    mock.expect_get_item(validate_get_item, Err(()));

    let result = get_current_kudos(URL, mock);
    assert!(result.is_err());
}

#[test]
pub fn increment_kudos_attempts_to_increment_value() {
    let mut mock = DynamoDbMock::default();
    
    let mut data = HashMap::new();
    
    data.insert("kudos".to_string(), AttributeValue {
        n: Some("1".to_string()),
        ..Default::default()
    });
    
    let output = UpdateItemOutput {
        consumed_capacity: None,
        attributes: Some(data),
        item_collection_metrics: None
    };

    mock.expect_update_item(validate_update_item, Ok(output));

    let result = increment_kudos(URL, mock);
    assert!(result.is_ok());
    assert_eq!(1, result.unwrap());
}

fn validate_get_item(req: GetItemInput) -> bool {
    validate_query_key(&req.key)
        && req.table_name == "kudos-please"
}

fn validate_update_item(req: UpdateItemInput) -> bool {
    validate_query_key(&req.key)
        && req.table_name == "kudos-please"
        && req.return_values.as_ref().unwrap().eq("UPDATED_NEW")
}

fn validate_query_key(key: &HashMap<String, AttributeValue>) -> bool {
    if let Some(attr) = key.get("url") {
        if let Some(data) = attr.s.as_ref() {
            return data.eq(URL)
        }
    }

    return false;
}

#[derive(Default)]
struct DynamoDbMock {
    get_item_expectation: Option<Expectation<GetItemInput, GetItemOutput>>,
    update_item_expectation: Option<Expectation<UpdateItemInput, UpdateItemOutput>>
}

struct Expectation<Req, Resp>{
    pub validation: Box<dyn Fn(Req) -> bool>,
    pub response: Result<Resp, ()>
}

impl DynamoDbMock {
    pub fn expect_get_item<F>(&mut self, validation: F, resp: Result<GetItemOutput, ()>)
        where F : 'static + Fn(GetItemInput) -> bool {
        self.get_item_expectation = Some(Expectation {
            validation: Box::new(validation),
            response: resp
        })
    }

    pub fn expect_update_item<F>(&mut self, validation: F, resp: Result<UpdateItemOutput, ()>)
        where F: 'static + Fn(UpdateItemInput) -> bool {
        self.update_item_expectation = Some(Expectation {
            validation: Box::new(validation),
            response: resp
        })
    }

    fn convert_result<T, U>(original: &Result<T, ()>) -> Result<T, RusotoError<U>>
        where T: Clone
    {
        // In our implementation, we just box the error - so not concerned with the type (for now)!
        match original {
            Ok(resp) => Ok(resp.clone()),
            Err(()) => Err(RusotoError::ParseError("Mocked error.".to_string()))
        }
    }
}

#[allow(unused)]
impl DynamoDb for DynamoDbMock {
    fn get_item(&self, input: GetItemInput) -> RusotoFuture<GetItemOutput, GetItemError> {
        assert!(self.get_item_expectation.is_some());

        let expectation = self.get_item_expectation.as_ref().unwrap();
        assert!((expectation.validation)(input));

        let result = DynamoDbMock::convert_result(&expectation.response);
        RusotoFuture::from(result)
    }

    fn update_item(&self, input: UpdateItemInput) -> RusotoFuture<UpdateItemOutput, UpdateItemError> {
        assert!(self.update_item_expectation.is_some());

        let expectation = self.update_item_expectation.as_ref().unwrap();
        assert!((expectation.validation)(input));

        let result = DynamoDbMock::convert_result(&expectation.response);
        RusotoFuture::from(result)
    }

    // The rest of these are not used so will be left unimplemented.

    fn batch_get_item(&self, input: BatchGetItemInput) -> RusotoFuture<BatchGetItemOutput, BatchGetItemError> {
        unimplemented!()
    }

    fn batch_write_item(&self, input: BatchWriteItemInput) -> RusotoFuture<BatchWriteItemOutput, BatchWriteItemError> {
        unimplemented!()
    }

    fn create_backup(&self, input: CreateBackupInput) -> RusotoFuture<CreateBackupOutput, CreateBackupError> {
        unimplemented!()
    }

    fn create_global_table(&self, input: CreateGlobalTableInput) -> RusotoFuture<CreateGlobalTableOutput, CreateGlobalTableError> {
        unimplemented!()
    }

    fn create_table(&self, input: CreateTableInput) -> RusotoFuture<CreateTableOutput, CreateTableError> {
        unimplemented!()
    }

    fn delete_backup(&self, input: DeleteBackupInput) -> RusotoFuture<DeleteBackupOutput, DeleteBackupError> {
        unimplemented!()
    }

    fn delete_item(&self, input: DeleteItemInput) -> RusotoFuture<DeleteItemOutput, DeleteItemError> {
        unimplemented!()
    }

    fn delete_table(&self, input: DeleteTableInput) -> RusotoFuture<DeleteTableOutput, DeleteTableError> {
        unimplemented!()
    }

    fn describe_backup(&self, input: DescribeBackupInput) -> RusotoFuture<DescribeBackupOutput, DescribeBackupError> {
        unimplemented!()
    }

    fn describe_continuous_backups(&self, input: DescribeContinuousBackupsInput) -> RusotoFuture<DescribeContinuousBackupsOutput, DescribeContinuousBackupsError> {
        unimplemented!()
    }

    fn describe_endpoints(&self) -> RusotoFuture<DescribeEndpointsResponse, DescribeEndpointsError> {
        unimplemented!()
    }

    fn describe_global_table(&self, input: DescribeGlobalTableInput) -> RusotoFuture<DescribeGlobalTableOutput, DescribeGlobalTableError> {
        unimplemented!()
    }

    fn describe_global_table_settings(&self, input: DescribeGlobalTableSettingsInput) -> RusotoFuture<DescribeGlobalTableSettingsOutput, DescribeGlobalTableSettingsError> {
        unimplemented!()
    }

    fn describe_limits(&self) -> RusotoFuture<DescribeLimitsOutput, DescribeLimitsError> {
        unimplemented!()
    }

    fn describe_table(&self, input: DescribeTableInput) -> RusotoFuture<DescribeTableOutput, DescribeTableError> {
        unimplemented!()
    }

    fn describe_time_to_live(&self, input: DescribeTimeToLiveInput) -> RusotoFuture<DescribeTimeToLiveOutput, DescribeTimeToLiveError> {
        unimplemented!()
    }

    fn list_backups(&self, input: ListBackupsInput) -> RusotoFuture<ListBackupsOutput, ListBackupsError> {
        unimplemented!()
    }

    fn list_global_tables(&self, input: ListGlobalTablesInput) -> RusotoFuture<ListGlobalTablesOutput, ListGlobalTablesError> {
        unimplemented!()
    }

    fn list_tables(&self, input: ListTablesInput) -> RusotoFuture<ListTablesOutput, ListTablesError> {
        unimplemented!()
    }

    fn list_tags_of_resource(&self, input: ListTagsOfResourceInput) -> RusotoFuture<ListTagsOfResourceOutput, ListTagsOfResourceError> {
        unimplemented!()
    }

    fn put_item(&self, input: PutItemInput) -> RusotoFuture<PutItemOutput, PutItemError> {
        unimplemented!()
    }

    fn query(&self, input: QueryInput) -> RusotoFuture<QueryOutput, QueryError> {
        unimplemented!()
    }

    fn restore_table_from_backup(&self, input: RestoreTableFromBackupInput) -> RusotoFuture<RestoreTableFromBackupOutput, RestoreTableFromBackupError> {
        unimplemented!()
    }

    fn restore_table_to_point_in_time(&self, input: RestoreTableToPointInTimeInput) -> RusotoFuture<RestoreTableToPointInTimeOutput, RestoreTableToPointInTimeError> {
        unimplemented!()
    }

    fn scan(&self, input: ScanInput) -> RusotoFuture<ScanOutput, ScanError> {
        unimplemented!()
    }

    fn tag_resource(&self, input: TagResourceInput) -> RusotoFuture<(), TagResourceError> {
        unimplemented!()
    }

    fn transact_get_items(&self, input: TransactGetItemsInput) -> RusotoFuture<TransactGetItemsOutput, TransactGetItemsError> {
        unimplemented!()
    }

    fn transact_write_items(&self, input: TransactWriteItemsInput) -> RusotoFuture<TransactWriteItemsOutput, TransactWriteItemsError> {
        unimplemented!()
    }

    fn untag_resource(&self, input: UntagResourceInput) -> RusotoFuture<(), UntagResourceError> {
        unimplemented!()
    }

    fn update_continuous_backups(&self, input: UpdateContinuousBackupsInput) -> RusotoFuture<UpdateContinuousBackupsOutput, UpdateContinuousBackupsError> {
        unimplemented!()
    }

    fn update_global_table(&self, input: UpdateGlobalTableInput) -> RusotoFuture<UpdateGlobalTableOutput, UpdateGlobalTableError> {
        unimplemented!()
    }

    fn update_global_table_settings(&self, input: UpdateGlobalTableSettingsInput) -> RusotoFuture<UpdateGlobalTableSettingsOutput, UpdateGlobalTableSettingsError> {
        unimplemented!()
    }

    fn update_table(&self, input: UpdateTableInput) -> RusotoFuture<UpdateTableOutput, UpdateTableError> {
        unimplemented!()
    }

    fn update_time_to_live(&self, input: UpdateTimeToLiveInput) -> RusotoFuture<UpdateTimeToLiveOutput, UpdateTimeToLiveError> {
        unimplemented!()
    }
}