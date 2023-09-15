import {
    Configuration,
    PlaidApi,
    PlaidEnvironments,
    TransactionsGetRequest,
} from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET } from '../config';

export class PlaidService {
    private client: PlaidApi;

    constructor() {
        const configuration = new Configuration({
            basePath: PlaidEnvironments.sandbox,
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
                    'PLAID-SECRET': PLAID_SECRET,
                },
            },
        });

        this.client = new PlaidApi(configuration);
    }

    /**
     * Fetches transactions for a given date range from a user's linked bank account in Plaid.
     *
     * @param {string} accessToken - The access token for the user's linked bank account.
     * @param {string} startDate - The start date for the transactions in the format 'YYYY-MM-DD'.
     * @param {string} endDate - The end date for the transactions in the format 'YYYY-MM-DD'.
     * @returns {Promise<any>} - The transactions data or an error message in case of failure.
     */
    async fetchTransactions(
        accessToken: string,
        startDate: string,
        endDate: string
    ): Promise<any> {
        try {
            const transactionsResponse = await this.client.transactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate,
                options: {
                    count: 100, // You can adjust the count and offset as needed
                    offset: 0,
                },
            });

            return transactionsResponse.data;
        } catch (error) {
            console.error("Couldn't fetch transactions", error);
            throw new Error('Error fetching transactions from Plaid.');
        }
    }
}
