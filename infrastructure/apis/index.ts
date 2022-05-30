import { Stack } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericLambda } from '../templates/genericLambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface apiProps {
    lambdaId: string,
    lambdaLocalPath: string,
    apiPath: string,
    httpMethod: string,
    apiGateway: RestApi,
    table?: Table,
    tablePermission?: string,
    multipleTableQueries?: boolean,
}

export const apiGatewayIntegration = (stack: Stack, props: apiProps[]): void => {
    props.forEach((prop: apiProps) => {
        // Create Lambda
        const lambda = new GenericLambda(stack, {
            id: prop.lambdaId,
            path: prop.lambdaLocalPath,
            table: prop.table,
            tablePermission: prop.tablePermission,
            multipleTableQueries: prop.multipleTableQueries
        })

        createApiIntegration(lambda.getLambda(), prop.apiGateway, prop.apiPath, prop.httpMethod)
    })
}

const createApiIntegration = (lambda: NodejsFunction, api: RestApi, path: string, httpMethod: string): void => {
    const lambdaIntegration = new LambdaIntegration(lambda);
    const lambdaResource = api.root.addResource(path);
    lambdaResource.addMethod(httpMethod, lambdaIntegration);
}


