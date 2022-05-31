import { Stack } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from '../templates/genericTable';
import { apiGatewayIntegration, apiProps } from './index';

export const productApiGatewayIntegration = (stack: Stack, api: RestApi, table: GenericTable): void => {
    // Define Lambdas and Api Gateway routes here
    const props: apiProps[] = [
        {
            lambdaId: 'productCreate',
            lambdaLocalPath: '/../../src/services/product/create.ts',
            apiPath: 'product',
            httpMethod: 'POST',
            apiGateway: api,
            table: table.getTable(),
            tablePermission: 'write'
        },
        {
            lambdaId: 'productRead',
            lambdaLocalPath: '/../../src/services/product/read.ts',
            apiPath: 'product',
            httpMethod: 'GET',
            apiGateway: api,
            table: table.getTable(),
            tablePermission: 'read'
        }
    ]

    // Create Lambdas and api gateway route using props as defined
    apiGatewayIntegration(stack, props)
}