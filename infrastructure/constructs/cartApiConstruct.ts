import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericLambda } from './genericLambda';
import { Stack } from 'aws-cdk-lib';

export interface CartApiConstructProps{
    table?: Table,
    apiGateway: RestApi,
}

export class CartApiConstruct{
    private props: CartApiConstructProps;
    private readonly stack: Stack;

    constructor(stack: Stack, props: CartApiConstructProps) {
        this.props = props;
        this.stack = stack;

        const optionsWithCors:ResourceOptions = {
            defaultCorsPreflightOptions : {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        // Create cart create Lambda
        const cartCreateLambda = new GenericLambda(this.stack, 'cartCreate',{
            path: '/../../src/services/cart/create.ts',
            table: this.props.table,
            tablePermission: 'write',
        })

        // Create cart api
        const cartResource = this.props.apiGateway.root.addResource('cart', optionsWithCors);

        // Create cart create api
        const cartCreateLambdaIntegration = new LambdaIntegration(cartCreateLambda.getLambda());
        cartResource.addMethod('POST', cartCreateLambdaIntegration);

        // Create cart read Lambda
        const cartReadLambda = new GenericLambda(this.stack, 'cartRead',{
            path: '/../../src/services/cart/read.ts',
            table: this.props.table,
            tablePermission: 'read',
        })

        // Create cart read api
        const cartReadLambdaIntegration = new LambdaIntegration(cartReadLambda.getLambda());
        cartResource.addMethod('GET', cartReadLambdaIntegration);

        // Create cart update Lambda
        const cartUpdateLambda = new GenericLambda(this.stack, 'cartUpdate',{
            path: '/../../src/services/cart/update.ts',
            table: this.props.table,
            tablePermission: 'write',
        })

        // Create cart Update api
        const cartUpdateLambdaIntegration = new LambdaIntegration(cartUpdateLambda.getLambda());
        cartResource.addMethod('PUT', cartUpdateLambdaIntegration);

        // Create cart delete Lambda
        const cartDeleteLambda = new GenericLambda(this.stack, 'cartDelete',{
            path: '/../../src/services/cart/delete.ts',
            table: this.props.table,
            tablePermission: 'write',
        })

        // Create cart delete api
        const cartDeleteLambdaIntegration = new LambdaIntegration(cartDeleteLambda.getLambda());
        cartResource.addMethod('DELETE', cartDeleteLambdaIntegration);
    }
}