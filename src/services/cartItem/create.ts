import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { generateRandomId, getEventBody, addCorsHeader } from '../../helpers/Utils'
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
        const item = getEventBody(event);
        item.id = generateRandomId();

        // validate cart item body
        validateCartItemEntry(item)

        const product = await getProduct(item.productId);
        
        if(product && product.Item && product.Item.quantity >= item.quantity){
            // Find user existing cart
            const existingCartItem = await getCartItemWithInputProduct(item.userId, product.Item.id)

            // If existed, increment quantity and update
            if(existingCartItem && existingCartItem.Count! > 0){
                result.statusCode = 422;
                result.body = 'Product existed in cart.'
            } else {
                await dbClient.put({
                    TableName: TABLE_NAME,
                    Item: item
                }).promise();

                result.body = JSON.stringify({
                    id: item.id
                })
            }
        } else {
            result.statusCode = 422;
            result.body = 'Product not found or insufficient.'
        }
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

async function getProduct(productId: string){
    return await dbClient.get({
        TableName: PRODUCT_TABLE_NAME,
        Key:{
            'id': productId
        }
    }).promise();
}

async function getCartItemWithInputProduct(userId: string, productId: string){
    return await dbClient.scan({
        TableName: TABLE_NAME,
        FilterExpression: '#userId = :userIdValue AND #productId = :productIdValue',
        ExpressionAttributeNames: {
            '#userId': 'userId',
            '#productId': 'productId'
        },
        ExpressionAttributeValues: {
            ':userIdValue': userId,
            ':productIdValue': productId
        }
    }).promise();
}



export { handler }