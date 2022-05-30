import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from '../templates/genericTable';
import {GenericLambda} from "../templates/genericLambda";

export class EcommerceRestApiStack extends Stack{

    // Create API Gateway
    private api = new RestApi(this, 'EcommerceApi');

    // Create Product Table
    private productTable = new GenericTable(
        this, {
            tableName: 'ProductTable',
            primaryKey: 'id',
        }
    )

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        const productCreateLambda = new GenericLambda(this, {
            id: 'productCreateLambda',
            path: '/../../src/services/product/create.ts',
            table: this.productTable.getTable(),
            tablePermission: 'write'
        })

        const productCreateLambdaIntegration = new LambdaIntegration(productCreateLambda.getLambda());
        const productCreateLambdaResource = this.api.root.addResource('productCreate');
        productCreateLambdaResource.addMethod('POST', productCreateLambdaIntegration);
    }
}