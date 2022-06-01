import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getEventBody, addCorsHeader } from '../../helpers/Utils'
import { MissingFieldError, validateProductEntry } from '../../validators/product';

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
        const productId = event.queryStringParameters?.['id']
        const product = productId ? await getTableRecordById(productId, TABLE_NAME) : undefined;

        // validate product body
        validateProductEntry(requestBody);

        //check if product is existed
        if (requestBody && product && product.Item) {
            const updateResult = await dbClient.update({
                TableName: TABLE_NAME,
                Key: {
                    'id': productId
                },
                UpdateExpression: 'set #name = :name, #brand = :brand, #description = :description, #imageUrl = :imageUrl, #quantity = :quantity, #sku = :sku, #category = :category',
                ExpressionAttributeValues: {
                    ':name': requestBody.name,
                    ':brand': requestBody.brand,
                    ':description': requestBody.description,
                    ':imageUrl': requestBody.imageUrl,
                    ':quantity': requestBody.quantity,
                    ':sku': requestBody.sku,
                    ':category': requestBody.category
                },
                ExpressionAttributeNames: {
                    '#name': 'name',
                    '#brand': 'brand',
                    '#description': 'description',
                    '#imageUrl': 'imageUrl',
                    '#quantity': 'quantity',
                    '#sku': 'sku',
                    '#category': 'category'
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();

            result.body = JSON.stringify(updateResult)
        } else {
            result.statusCode = 422;
            result.body = 'Product not found.'
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

async function getTableRecordById(id: string, tableName: string){
    return await dbClient.get({
        TableName: tableName,
        Key:{
            'id': id
        }
    }).promise();
}

export { handler }