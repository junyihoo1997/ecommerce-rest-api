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
        const productId = event.queryStringParameters?.['productId']
        if (productId) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: {
                    id: productId
                }
            }).promise();
            result.body = JSON.stringify(deleteResult);
        }
    }
    catch (error: any) {
        result.statusCode = 500;
        result.body = error.message
    }

    return result;
}

export { handler }