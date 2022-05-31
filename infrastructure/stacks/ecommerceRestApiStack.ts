import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from '../constructs/genericTable';
import { ProductApiConstruct } from '../constructs/productApiConstruct';
import { CartApiConstruct } from '../constructs/cartApiConstruct';

export class EcommerceRestApiStack extends Stack{
    // Create API Gateway
    private api = new RestApi(this, 'EcommerceApi');

    // Create Product Table
    private productTable = new GenericTable(
        this, {
            tableName: 'Product',
            primaryKey: 'id',
            secondaryIndexes: ['name']
        }
    )

    // Create Cart Table
    private cartTable = new GenericTable(
        this, {
            tableName: 'Cart',
            primaryKey: 'id',
        }
    )

    // Create Cart Item Table
    private cartItemTable = new GenericTable(
        this, {
            tableName: 'CartItem',
            primaryKey: 'id',
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
        new CartApiConstruct(this, {
            table: this.cartTable.getTable(),
            apiGateway: this.api
        });
    }
}