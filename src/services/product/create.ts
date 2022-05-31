import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { generateRandomId, getEventBody, addCorsHeader } from '../../helpers/Utils'
import { MissingFieldError, validateProductCreateEntry } from '../../validators/product';

const TABLE_NAME = process.env.TABLE_NAME as string;
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
        // validate product body
        validateProductCreateEntry(item);

        await dbClient.put({
            TableName: TABLE_NAME,
            Item: item
        }).promise();

        result.body = JSON.stringify({
            id: item.id
        })
    }
    catch (error: any) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 422;
            result.body = error.message
        } else {
            result.statusCode = 500;
        }
        result.body = 'Something went wrong'
    }

    return result;
}

export { handler }