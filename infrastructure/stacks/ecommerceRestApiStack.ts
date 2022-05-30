import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from '../templates/genericTable';
import { productApiGatewayIntegration } from "../apis/product";

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

        // Create Product lambdas and api routes with apiGw
        productApiGatewayIntegration(this, this.api, this.productTable);
    }
}