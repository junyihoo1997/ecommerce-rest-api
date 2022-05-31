import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericLambda } from './genericLambda';
import { Stack } from 'aws-cdk-lib';
import {TableName} from "../../src/enums";

export interface CartItemApiConstructProps{
    table: Table,
    apiGateway: RestApi,
}

export class CartItemApiConstruct {
    private props: CartItemApiConstructProps;
    private readonly stack: Stack;

    constructor(stack: Stack, props: CartItemApiConstructProps) {
        this.props = props;
        this.stack = stack;

        const optionsWithCors:ResourceOptions = {
            defaultCorsPreflightOptions : {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        // Create cartItem create Lambda
        const cartItemCreateLambda = new GenericLambda(this.stack, 'cartCreate',{
            path: '/../../src/services/cartItem/create.ts',
            table: this.props.table,
            tablePermission: 'full',
            multipleTableAccess: true,
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                },
                {
                    key: 'PRODUCT_TABLE_NAME',
                    value: TableName.PRODUCT_TABLE
                }
            ]
        })

        // Create cartItem api
        const cartItemResource = this.props.apiGateway.root.addResource('cart', optionsWithCors);

        // Create cartItem create api
        const cartCreateLambdaIntegration = new LambdaIntegration(cartItemCreateLambda.getLambda());
        cartItemResource.addMethod('POST', cartCreateLambdaIntegration);

        // Create cartItem read Lambda
        const cartItemReadLambda = new GenericLambda(this.stack, 'cartRead',{
            path: '/../../src/services/cartItem/read.ts',
            table: this.props.table,
            tablePermission: 'read',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create cartItem read api
        const cartItemReadLambdaIntegration = new LambdaIntegration(cartItemReadLambda.getLambda());
        cartItemResource.addMethod('GET', cartItemReadLambdaIntegration);

        // Create cartItem update Lambda
        const cartItemUpdateLambda = new GenericLambda(this.stack, 'cartUpdate',{
            path: '/../../src/services/cartItem/update.ts',
            table: this.props.table,
            tablePermission: 'full',
            multipleTableAccess: true,
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                },
                {
                    key: 'PRODUCT_TABLE_NAME',
                    value: TableName.PRODUCT_TABLE
                }
            ]
        })

        // Create cartItem Update api
        const cartItemUpdateLambdaIntegration = new LambdaIntegration(cartItemUpdateLambda.getLambda());
        cartItemResource.addMethod('PUT', cartItemUpdateLambdaIntegration);

        // Create cartItem delete Lambda
        const cartItemDeleteLambda = new GenericLambda(this.stack, 'cartDelete',{
            path: '/../../src/services/cartItem/delete.ts',
            table: this.props.table,
            tablePermission: 'write',
            environments: [
                {
                    key: 'TABLE_NAME',
                    value: this.props.table.tableName
                }
            ]
        })

        // Create cartItem delete api
        const cartItemDeleteLambdaIntegration = new LambdaIntegration(cartItemDeleteLambda.getLambda());
        cartItemResource.addMethod('DELETE', cartItemDeleteLambdaIntegration);
    }
}