import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { GenericTable } from './genericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class EcommerceRestApiStack extends Stack{

    private api = new RestApi(this, 'EcommerceApi');

    private productTable = new GenericTable(
        'product',
        'id',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        const productLambda = new NodejsFunction(this, 'productLambda', {
            entry: (join(__dirname,'..','src','services','product', 'product.ts')),
            handler: 'handler'
        })

        const productCreateLambda = new NodejsFunction(this, 'productCreateLambda', {
            entry: (join(__dirname,'..','src','services','product', 'create.ts')),
            handler: 'handler'
        })


        const productLambdaIntegration = new LambdaIntegration(productLambda);
        const productLambdaResource = this.api.root.addResource('product');
        productLambdaResource.addMethod('GET', productLambdaIntegration);

        const productCreateLambdaIntegration = new LambdaIntegration(productCreateLambda);
        const productCreateLambdaResource = this.api.root.addResource('productCreate');
        productCreateLambdaResource.addMethod('POST', productCreateLambdaIntegration);
    }
}