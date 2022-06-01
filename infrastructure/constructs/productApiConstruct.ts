import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Cors, LambdaIntegration, ResourceOptions, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { GenericLambda } from './genericLambda';
import { Stack } from 'aws-cdk-lib';

export interface ProductApiConstructProps{
    table: Table,
    apiGateway: RestApi,
}

export class ProductApiConstruct{
    private props: ProductApiConstructProps;
    private readonly stack: Stack;

    constructor(stack: Stack, props: ProductApiConstructProps) {
        this.props = props;
        this.stack = stack;

        const optionsWithCors:ResourceOptions = {
            defaultCorsPreflightOptions : {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        // Create product create Lambda
        const productCreateLambda = new GenericLambda(this.stack, 'productCreate',{
            path: '/../../src/services/product/create.ts',
            table: this.props.table,
            tablePermission: 'write',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create product api
        const productResource = this.props.apiGateway.root.addResource('product', optionsWithCors);

        // Create product create api
        const productCreateLambdaIntegration = new LambdaIntegration(productCreateLambda.getLambda());
        productResource.addMethod('POST', productCreateLambdaIntegration);

        // Create product read Lambda
        const productReadLambda = new GenericLambda(this.stack, 'productRead',{
            path: '/../../src/services/product/read.ts',
            table: this.props.table,
            tablePermission: 'read',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create product read api
        const productReadLambdaIntegration = new LambdaIntegration(productReadLambda.getLambda());
        productResource.addMethod('GET', productReadLambdaIntegration);

        // Create product update Lambda
        const productUpdateLambda = new GenericLambda(this.stack, 'productUpdate',{
            path: '/../../src/services/product/update.ts',
            table: this.props.table,
            tablePermission: 'readWrite',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create product Update api
        const productUpdateLambdaIntegration = new LambdaIntegration(productUpdateLambda.getLambda());
        productResource.addMethod('PUT', productUpdateLambdaIntegration);

        // Create product delete Lambda
        const productDeleteLambda = new GenericLambda(this.stack, 'productDelete',{
            path: '/../../src/services/product/delete.ts',
            table: this.props.table,
            tablePermission: 'readWrite',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create product delete api
        const productDeleteLambdaIntegration = new LambdaIntegration(productDeleteLambda.getLambda());
        productResource.addMethod('DELETE', productDeleteLambdaIntegration);
    }
}