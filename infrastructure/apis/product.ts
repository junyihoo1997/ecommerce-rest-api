import {Stack} from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import {GenericLambda} from "../templates/genericLambda";
import {GenericTable} from "../templates/genericTable";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export interface apiProps {
    lambdaId: string,
    lambdaLocalPath: string,
    apiPath: string,
    httpMethod: string,
    apiGateway: RestApi,
    table?: Table,
    tablePermission?: string
}

export async function productApiGatewayIntegration(stack: Stack, api: RestApi, table: GenericTable){
    // Define Lambdas and Api Gateway routes
    const props: apiProps[] = [
        {
            lambdaId: 'productCreateLambda',
            lambdaLocalPath: '/../../src/services/product/create.ts',
            apiPath: 'productCreate',
            httpMethod: 'POST',
            apiGateway: api,
            table: table.getTable(),
            tablePermission: 'write'
        }
    ]

    createLambdasWithApi(stack, props);
}

function createLambdasWithApi(stack: Stack, props: apiProps[]) {
    props.forEach((prop: apiProps) => {
        const lambda = new GenericLambda(stack, {
            id: prop.lambdaId,
            path: prop.lambdaLocalPath,
            table: prop.table,
            tablePermission: prop.tablePermission
        })

        createApiIntegration(lambda.getLambda(), prop.apiGateway, prop.apiPath, prop.httpMethod)
    })
}

function createApiIntegration(lambda: NodejsFunction, api: RestApi, path: string, httpMethod: string){
    const lambdaIntegration = new LambdaIntegration(lambda);
    const lambdaResource = api.root.addResource(path);
    lambdaResource.addMethod(httpMethod, lambdaIntegration);
}

