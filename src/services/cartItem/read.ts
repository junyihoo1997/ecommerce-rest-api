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
                result.body = await getWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
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
        TableName: TABLE_NAME,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey
        },
        ExpressionAttributeValues: {
            ':zzzz': queryValue
        }
    }).promise();

    if (!queryResponse || queryResponse.Count! <= 0) return 'Cart item not found.'

    return JSON.stringify(queryResponse.Items);
}

async function getWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams['id'];
    const queryResponse = await dbClient.get({
        TableName: TABLE_NAME,
        Key:{
            'id': keyValue
        }
    }).promise();

    if (!queryResponse || undefined) return 'Cart item not found.'

    return JSON.stringify(queryResponse.Item);
}

export { handler }