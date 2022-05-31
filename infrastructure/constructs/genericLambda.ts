import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path';
import {aws_iam, Stack} from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface LambdaEnvironments {
    key: string,
    value: string
}

export interface LambdaProps {
    path: string,
    table?: Table,
    tablePermission?: string,
    multipleTableAccess?: boolean,
    environments?: LambdaEnvironments[]
}

export class GenericLambda{
    private lambda: NodejsFunction;
    private props: LambdaProps;
    private readonly stack: Stack;
    private readonly id: string;

    public constructor(stack: Stack, id: string, props: LambdaProps){
        this.id = id;
        this.stack = stack;
        this.props = props;
        this.initialize();
    }

    private initialize(){
        this.createLambda();
        this.addEnvironments();
        this.grantTableRights();
        this.grantMultipleTableAccessRights();
    }

    private createLambda(){
        this.lambda = new NodejsFunction(this.stack, this.id, {
            entry: path.join(__dirname, this.props.path),
        })
    }

    private addEnvironments(){
        if(this.props.environments){
            this.props.environments.forEach((env)=>{
                this.lambda.addEnvironment(env.key,env.value)
            })
        }
    }

    private grantMultipleTableAccessRights(){
        if(this.props.multipleTableAccess){
            this.lambda.role?.addManagedPolicy(
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonDynamoDBFullAccess'
                )
            )
        }
    }

    private grantTableRights(){
        if(this.props.table && this.props.tablePermission){
            if(this.props.tablePermission == 'write') this.props.table.grantWriteData(this.lambda);
            if(this.props.tablePermission == 'read') this.props.table.grantReadData(this.lambda);
            if(this.props.tablePermission == 'readWrite') this.props.table.grantReadWriteData(this.lambda);
            if(this.props.tablePermission == 'full') this.props.table.grantFullAccess(this.lambda);
        }
    }

    public getLambda(): NodejsFunction{
        return this.lambda;
    }
}