import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { generateRandomId, getEventBody, addCorsHeader } from '../../utils/Utils'

const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }
    addCorsHeader(result)
    try{
        const item = getEventBody(event);
        item.id = generateRandomId();
        await dbClient.put({
            TableName: 'product',
            Item: item
        }).promise();
        result.body = JSON.stringify({
            id: item.id
        })
    } catch (error: any) {
        result.body = error.message
    }

    return result;
}

export { handler }