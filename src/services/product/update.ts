import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { generateRandomId, getEventBody, addCorsHeader } from '../../helpers/Utils'
import {MissingFieldError, validateAsProductEntry} from '../../validators/product';

const TABLE_NAME = process.env.TABLE_NAME as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }
    addCorsHeader(result)
    try{
        const requestBody = getEventBody(event);
        const productId = event.queryStringParameters?.['productId']

        // validate product body
        validateAsProductEntry(requestBody);

        if (requestBody && productId) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME,
                Key: {
                    'id': productId
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeValues: {
                    ':new': requestBodyValue
                },
                ExpressionAttributeNames: {
                    '#zzzNew': requestBodyKey
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();

            result.body = JSON.stringify(updateResult)
        }
    }
    catch (error: any) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
        } else {
            result.statusCode = 500;
        }
        result.body = error.message
    }

    return result;
}

export { handler }