import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from "path";
import {Stack} from "aws-cdk-lib";
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface LambdaProps {
    id: string,
    path: string,
    table?: Table,
    tablePermission?: string
}

export class GenericLambda{
    private lambda: NodejsFunction;
    private stack: Stack;
    private props: LambdaProps

    public constructor(stack: Stack, props: LambdaProps){
        this.stack = stack;
        this.props = props;
        this.initialize();
    }

    private initialize(){
        this.createLambda();
        this.grantTableRights();
    }

    private createLambda(){
        this.lambda = new NodejsFunction(this.stack, this.props.id, {
            entry: path.join(__dirname, this.props.path),
        })
    }

    private grantTableRights(){
        if(this.props.table && this.props.tablePermission){
            if(this.props.tablePermission == 'write') this.props.table.grantWriteData(this.lambda);
            if(this.props.tablePermission == 'read') this.props.table.grantReadData(this.lambda);
            if(this.props.tablePermission == 'readWrite') this.props.table.grantReadWriteData(this.lambda);
            if(this.props.tablePermission == 'full') this.props.table.grantFullAccess(this.lambda);
        }
    }

    public getLambda(){
        return this.lambda;
    }
}