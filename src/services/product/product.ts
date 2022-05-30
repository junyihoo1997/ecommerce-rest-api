async function handler(event: any, context:any) {
    return {
        statusCode: 200,
        body: 'Hello World from aws cdk'
    }
}

export { handler }