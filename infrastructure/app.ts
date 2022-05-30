import { EcommerceRestApiStack } from './stacks/ecommerceRestApiStack';
import { App } from 'aws-cdk-lib'

const app = new App();
new EcommerceRestApiStack(app, 'Ecommerce-Rest-Api', {
    stackName: 'EcommerceRestApi'
})