import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class EcommerceRestApiStack extends Stack{

    private api = new RestApi(this, 'EcommerceApi');
    private productTable = new GenericTable(
        'ProductTable',
        'productId',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        // const productLambda = new LambdaFunction(this, 'productLambda',{
        //     runtime: Runtime.NODEJS_16_X,
        //     code: Code.fromAsset(join(__dirname,'..','services','ProductTable')),
        //     handler: 'product.main'
        // });

        const productLambda = new NodejsFunction(this, 'productLambda', {
            entry: (join(__dirname,'..','services','ProductTable', 'product.ts'))
        })

        const productLambdaIntegration = new LambdaIntegration(productLambda);
        const productLambdaResource = this.api.root.addResource('product');
        productLambdaResource.addMethod('GET', productLambdaIntegration);
    }
}