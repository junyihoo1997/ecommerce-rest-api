import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../../helpers/Utils'

const TABLE_NAME = process.env.TABLE_NAME as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }
    addCorsHeader(result)
    try {
        if (event.queryStringParameters) {
            if ('id' in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        } else {
            result.body = await scanTable();
        }
    } catch (error: any) {
        result.statusCode = 500;
        result.body = error.message
    }
    return result
}

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey
        },
        ExpressionAttributeValues: {
            ':zzzz': queryValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams['id'];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': 'id'
        },
        ExpressionAttributeValues: {
            ':zzzz': keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function scanTable(){
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME
    }).promise();
    return JSON.stringify(queryResponse.Items)
}

export { handler }