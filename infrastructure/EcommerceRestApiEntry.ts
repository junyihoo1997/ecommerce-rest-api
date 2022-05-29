import { EcommerceRestApiStack } from './EcommerceRestApiStack';
import { App } from 'aws-cdk-lib'

const app = new App();
new EcommerceRestApiStack(app, 'Ecommerce-Rest-Api', {
    stackName: 'EcommerceRestApi'
})