# Discord Bot Connect with Plaid and Chat GPT

Welcome to Nisa.ai's internal Discord bot project. This bot, built using TypeScript, not only facilitates engaging interactions via OpenAI's GPT-4 model within our Discord server but also integrates with Plaid for advanced financial functionalities.

## 🌟 Features

-   **OpenAI Integration**: Leverage the advanced capabilities of OpenAI's GPT-4 model to engage and interact with users on our Discord server.

-   **Plaid Integration**: Our bot intelligently integrates with Plaid to offer financial insights, fetch transactions, check account balances, and more, all driven by user input.

-   **Intelligent API Decisions**: Through the integration of OpenAI, our bot is able to derive what Plaid API should be called based on the nuances of user input. It ensures relevant responses and actions are made to fit user inquiries.

-   **TypeScript Powered**: Experience enhanced type safety leading to robust code and a superior developer experience.

-   **Scalable Architecture**: Our bot is designed with the future in mind. Expand and add more features with ease as our needs evolve.

-   **Permission System**: Introducing a versatile permission system! Now, create commands that are only accessible based on custom permissions you set.

-   **Developer Exclusive Commands**: Restrict certain commands to the developer team. With our new feature, you can design commands exclusively for developers.

-   **Disable Commands**: Easily disable any command to prevent its usage, offering you greater control over the bot's functionalities.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

-   Node.js (v14 or higher is recommended)
-   TypeScript (v4 or higher is recommended)

### Setup & Installation

Follow the steps below to get the bot up and running:

1. **Clone the Repository**:

    ```bash
    git clone git@github.com:Summary-Box/discord-bot-cp.git
    ```

2. **Navigate to the Project Directory**:

    ```bash
    cd discord-bot
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Compile the TypeScript Code**:

    ```bash
    npm run build
    ```

5. **Start the Bot**:

    ```bash
    npm start
    ```

For development purposes, use:

```bash
npm run dev
```

This command watches for any changes in TypeScript files and restarts the bot automatically.

### Testing

Maintain high code quality and functionality by running tests:

```bash
npm test
```

## 📦 Packages & Libraries

We've integrated some of the best libraries and packages to enhance our bot's functionality:

-   [discord.js](https://www.npmjs.com/package/discord.js): For seamless Discord API interactions.
-   [openai](https://www.npmjs.com/package/openai): Official OpenAI Node.js client.
-   [plaid](https://www.npmjs.com/package/plaid): A powerful library for interacting with the Plaid financial API.
-   [dotenv](https://www.npmjs.com/package/dotenv): Efficiently manage environment variables.
-   [jest](https://www.npmjs.com/package/jest) & [ts-jest](https://www.npmjs.com/package/ts-jest): Essential testing utilities for our codebase.
-   [tsc-watch](https://www.npmjs.com/package/tsc-watch): Enhanced TypeScript compilation.
-   [prettier](https://www.npmjs.com/package/prettier): Keeping our code clean and formatted.
