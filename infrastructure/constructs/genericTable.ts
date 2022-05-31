import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export interface TableProps {
    tableName: string,
    primaryKey: string,
    secondaryIndexes?: string[]
}

export class GenericTable{
    private readonly stack: Stack;
    private table: Table;
    private props: TableProps

    public constructor(stack: Stack, props: TableProps){
        this.stack = stack;
        this.props = props
        this.initialize();
    }

    private initialize(){
        this.createTable();
        this.addSecondaryIndexes();
    }

    private createTable(){
        this.table = new Table(this.stack, this.props.tableName, {
            partitionKey: {
                name: this.props.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this.props.tableName,
        })
    }

    private addSecondaryIndexes(){
        if (this.props.secondaryIndexes) {
            for (const secondaryIndex of this.props.secondaryIndexes) {
                this.table.addGlobalSecondaryIndex({
                    indexName: secondaryIndex,
                    partitionKey: {
                        name: secondaryIndex,
                        type: AttributeType.STRING
                    }
                })
            }
        }
    }

    public getTable(){
        return this.table;
    }
}