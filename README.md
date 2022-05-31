# Examples Ecommerce Serverless Rest API using AWS CDK (Cloud Development Kit)

This repository contains of example ecommerce serverless rest api project using [AWS Cloud Development
Kit](https://github.com/awslabs/aws-cdk).

## Table of Contents
1. [How to Deploy Examples](#Steps)
2. [Other Commands](#Commands)
3. [Official Resources](#Learning)


### How to Deploy Examples (Steps)<a name="Steps"></a>

Install the CDK CLI globally  
`npm install -g aws-cdk`

Configure aws credentials  
`aws configure`

Change directory to project directory<br/>
`cd ecommerce-rest-api`

Install dependencies  
`npm install`

Synthesizes and prints the CloudFormation template for the stack<br/> 
`cdk synth`

Bootstrap the stack<br/>
`cdk bootstrap`

Deploy using the CDK CLI or terminal  
`cdk deploy`


### Other CLI Commands<a name="Commands"></a>

- `cdk diff` Prints out the difference in stacks

- `cdk destroy` Removes the stack

- `cdk list` List the applications in given folder

- `cdk synth`  Synthesizes and prints the CloudFormation template for the stack

- `cdk init` Generates a new cdk project

- `cdk doctor` Checks the CDK setup


### Official Resources<a name="Learning"></a>
- [Developer Guide](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
- [CDK Workshop](https://cdkworkshop.com/)
- [CDK Repository](https://github.com/aws/aws-cdk)
