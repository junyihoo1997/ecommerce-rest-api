import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }

    return result;
}

export { handler }