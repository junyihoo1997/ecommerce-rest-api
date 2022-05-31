import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../../helpers/Utils'

const TABLE_NAME = process.env.TABLE_NAME as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }
    addCorsHeader(result)
    try{
        const cartItemId = event.queryStringParameters?.['id']
        if (cartItemId) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: {
                    id: cartItemId
                }
            }).promise();
            result.body = JSON.stringify(deleteResult);
        } else{
            result.statusCode = 422;
            result.body = 'Cart Item not found.'
        }
    }
    catch (error: any) {
        result.statusCode = 500;
        result.body = 'Something went wrong'
    }

    return result;
}

export { handler }