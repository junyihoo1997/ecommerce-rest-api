import { APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

// For future use
export const authorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent) => {
    const token = event.authorizationToken;
    let effect = 'Deny';

    if (compareTokenWithCredentials(token, "user", "pass")) {
        effect = 'Allow';
    }

    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: '*',
                },
            ],
        },
    }
};

const btoa = (str: string) => Buffer.from(str).toString('base64');

const compareTokenWithCredentials = (token: string, user: string, pass: string) => token === `Basic ${btoa(`${user}:${pass}`)}`;
