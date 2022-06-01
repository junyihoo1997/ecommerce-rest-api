import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody, addCorsHeader } from '../../helpers/Utils'
import { MissingFieldError, validateCartItemUpdateEntry } from '../../validators/cartItem';

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
        const cartItem = cartItemId ? await getTableRecordById(cartItemId, TABLE_NAME) : undefined;

        // validate cart item body
        validateCartItemUpdateEntry(requestBody);

        if (requestBody && cartItem && cartItem.Item) {
            // Validate with product and product quantity
            const product = await getTableRecordById(cartItem.Item.productId, PRODUCT_TABLE_NAME);

            if(product && product.Item && product.Item.quantity >= requestBody.quantity) {
                const updateResult = await dbClient.update({
                    TableName: TABLE_NAME,
                    Key: {
                        'id': cartItemId
                    },
                    UpdateExpression: 'set #quantity = :quantity',
                    ExpressionAttributeValues: {
                        ':quantity': requestBody.quantity
                    },
                    ExpressionAttributeNames: {
                        '#quantity': 'quantity'
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
        result.body = error.message
    }

    return result;
}

async function getTableRecordById(id: string, tableName: string){
    return await dbClient.get({
        TableName: tableName,
        Key:{
            'id': id
        }
    }).promise();
}

export { handler }