import * as nacl from 'tweetnacl';
import * as AWS from 'aws-sdk';

interface DiscordEvent {
    body: string;
    headers: {
        [key: string]: string;
    };
}

interface DiscordBody {
    type: number;
    data: {
        name?: string;
    };
}

export const handler = async (event: DiscordEvent) => {
    const strBody = event.body; // should be string, for successful sign

    if (!event.headers['test']) {
        // Checking signature (requirement 1.)
        // Your public key can be found on your application in the Developer Portal
        const PUBLIC_KEY = process.env.PUBLIC_KEY!;
        const signature =
            event.headers['x-signature-ed25519'] ||
            event.headers['X-Signature-Ed25519'];
        const timestamp =
            event.headers['x-signature-timestamp'] ||
            event.headers['X-Signature-Timestamp'];

        const isVerified = nacl.sign.detached.verify(
            Buffer.from(timestamp + strBody),
            Buffer.from(signature, 'hex'),
            Buffer.from(PUBLIC_KEY, 'hex')
        );

        if (!isVerified) {
            return {
                statusCode: 401,
                body: JSON.stringify('invalid request signature'),
            };
        }
    }

    // Replying to ping (requirement 2.)
    const body: DiscordBody = JSON.parse(strBody);
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        };
    }

    // Handle command (send to SNS and split to one of Lambdas)
    if (body.data.name) {
        const eventText = JSON.stringify(body, null, 2);
        const params = {
            Message: eventText,
            Subject: 'Test SNS From Lambda',
            TopicArn: process.env.TOPIC_ARN!,
            MessageAttributes: {
                command: { DataType: 'String', StringValue: body.data.name },
            },
        };

        // Create promise and SNS service object
        await new AWS.SNS({ apiVersion: '2010-03-31' })
            .publish(params)
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content:
                        '*⏳ Loading...* (this may take a while), please wait...',
                },
            }),
        };
    }

    return {
        statusCode: 404,
    };
};
