import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, ACCESS_TOKEN } from '../config';

export class PlaidService {
    private client: PlaidApi;
    private accessToken: string;

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
        this.accessToken = ACCESS_TOKEN;
    }

    /**
     * Fetches transactions for a given date range from a user's linked bank account in Plaid.
     *
     * @param {string} startDate - The start date for the transactions in the format 'YYYY-MM-DD'.
     * @param {string} endDate - The end date for the transactions in the format 'YYYY-MM-DD'.
     * @returns {Promise<any>} - The transactions data or an error message in case of failure.
     */
    async getTransactions(startDate?: string, endDate?: string): Promise<any> {
        try {
            const transactionsResponse = await this.client.transactionsGet({
                access_token: this.accessToken,
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

    /**
     * Retrieves account and routing numbers for checking and savings accounts.
     * @returns {Promise<any>} - Returns account details or throws an error.
     */
    async getAccountDetails(): Promise<any> {
        try {
            const authResponse = await this.client.authGet({
                access_token: this.accessToken,
            });
            return authResponse.data;
        } catch (error) {
            console.error("Couldn't fetch account details", error);
            throw new Error('Error fetching account details from Plaid.');
        }
    }

    /**
     * Fetches real-time account balances to help prevent non-sufficient funds fees.
     * @returns {Promise<any>} - Returns the account balance or throws an error.
     */
    async getAccountBalance(): Promise<any> {
        try {
            const balanceResponse = await this.client.accountsBalanceGet({
                access_token: this.accessToken,
            });
            return balanceResponse.data;
        } catch (error) {
            console.error("Couldn't fetch account balance", error);
            throw new Error('Error fetching account balance from Plaid.');
        }
    }

    /**
     * Obtains details about an item, like the institution, billed products, etc.
     * @returns {Promise<any>} - Returns item details or throws an error.
     */
    async getItemDetails(): Promise<any> {
        try {
            const itemResponse = await this.client.itemGet({
                access_token: this.accessToken,
            });
            return itemResponse.data;
        } catch (error) {
            console.error("Couldn't fetch item details", error);
            throw new Error('Error fetching item details from Plaid.');
        }
    }

    /**
     * Gets high-level info about all accounts associated with an item.
     * @returns {Promise<any>} - Returns details of all accounts or throws an error.
     */
    async getAccounts(): Promise<any> {
        try {
            const accountsResponse = await this.client.accountsGet({
                access_token: this.accessToken,
            });
            return accountsResponse.data;
        } catch (error) {
            console.error("Couldn't fetch accounts", error);
            throw new Error('Error fetching accounts from Plaid.');
        }
    }
}
