import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody, addCorsHeader } from '../../helpers/Utils'
import { MissingFieldError, validateCartItemEntry } from '../../validators/cartItem';

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Default body from lambda'
    }
    addCorsHeader(result)
    try{
        const requestBody = getEventBody(event);
        const cartItemId = event.queryStringParameters?.['id']

        // validate cart item body
        validateCartItemEntry(requestBody);

        if (requestBody && cartItemId) {
            // Validate with product and product quantity
            const product = await dbClient.get({
                TableName: PRODUCT_TABLE_NAME,
                Key:{
                    'id': requestBody.productId
                }
            }).promise();

            if(product && product.Item && product.Item.quantity >= requestBody.quantity) {
                const requestBodyKey = Object.keys(requestBody)[0];
                const requestBodyValue = requestBody[requestBodyKey];

                const updateResult = await dbClient.update({
                    TableName: TABLE_NAME,
                    Key: {
                        'id': cartItemId
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
            } else {
                result.statusCode = 422;
                result.body = 'Product not found or insufficient.'
            }
        } else {
            result.statusCode = 422;
            result.body = 'Cart Item not found.'
        }
    }
    catch (error: any) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 422;
            result.body = error.message
        } else {
            result.statusCode = 500;
        }
        result.body = 'something went wrong'
    }

    return result;
}

export { handler }