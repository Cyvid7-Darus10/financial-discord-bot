import axios from 'axios';

interface SNSEvent {
    Records: Array<{
        Sns: {
            Message: string;
        };
    }>;
}

export const globalHandler = async (
    event: SNSEvent,
    action: (body: any) => Promise<any>
) => {
    const body = JSON.parse(event.Records[0].Sns.Message);
    const response = await action(body);
    axios
        .patch(
            `https://discord.com/api/v10/webhooks/${body.application_id}/${body.token}/messages/@original`,
            response
        )
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
};
