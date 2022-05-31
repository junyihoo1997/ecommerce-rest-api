import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from '../constructs/genericTable';
import { ProductApiConstruct } from '../constructs/productApiConstruct';
import { CartItemApiConstruct } from '../constructs/cartItemApiConstruct';
import { TableName } from '../../src/enums';

export class EcommerceRestApiStack extends Stack{
    // Create API Gateway
    private api = new RestApi(this, 'EcommerceApi');

    // Create Product Table
    private productTable = new GenericTable(
        this, {
            tableName: TableName.PRODUCT_TABLE,
            primaryKey: 'id',
            secondaryIndexes: ['name']
        }
    )

    // Create Cart Item Table
    private cartItemTable = new GenericTable(
        this, {
            tableName: TableName.CART_ITEM,
            primaryKey: 'id',
            secondaryIndexes: ['userId']
        }
    )

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        // Create Product Apis
        new ProductApiConstruct(this, {
            table: this.productTable.getTable(),
            apiGateway: this.api
        });

        // Create Cart Apis
        new CartItemApiConstruct(this, {
            table: this.cartItemTable.getTable(),
            apiGateway: this.api
        });
    }
}