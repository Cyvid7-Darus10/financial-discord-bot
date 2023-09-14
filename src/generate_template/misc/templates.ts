interface Resource {
    Type: string;
    Properties: {
        Handler: string;
        Runtime: string;
        Architectures: string[];
        MemorySize: number;
        Timeout: number;
        Policies: string[];
        Events: {
            SNSEvent: {
                Type: string;
                Properties: {
                    Topic: {
                        Ref: string;
                    };
                    FilterPolicy: {
                        command: string[];
                    };
                };
            };
        };
    };
}

export const templateResource = (
    module: string,
    command: string,
    name: string
): Resource => {
    return {
        Type: 'AWS::Serverless::Function',
        Properties: {
            Handler: `discord/${module}/${command.replace('.js', '')}.handler`,
            Runtime: 'nodejs18.x',
            Architectures: ['x86_64'],
            MemorySize: 128,
            Timeout: 100,
            Policies: ['AWSLambdaBasicExecutionRole'],
            Events: {
                SNSEvent: {
                    Type: 'SNS',
                    Properties: {
                        Topic: {
                            Ref: 'MainSNSTopic',
                        },
                        FilterPolicy: {
                            command: [name],
                        },
                    },
                },
            },
        },
    };
};

export const handleNameChange = (
    resource: Resource,
    name: string
): Resource => {
    resource.Properties.Events.SNSEvent.Properties.FilterPolicy.command = [
        name,
    ];
    return resource;
};
