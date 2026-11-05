# DApp Architecture, Wallet Setup, and Smart Contract Deployment

## Overview

This module introduces the fundamental architecture of a Decentralized Application (DApp) and prepares the smart contract that will later be integrated into the frontend application.

The module covers three main areas:

1. Understanding how a DApp works and how its frontend communicates with smart contracts.
2. Setting up a cryptocurrency wallet and preparing it for blockchain interaction.
3. Creating, compiling, and deploying a Solidity smart contract to the Sepolia testnet using Foundry.

By the end of this module, we have a deployed smart contract and the two essential pieces of information required for frontend integration: its **Application Binary Interface (ABI)** and **contract address**.

---

## 1. Understanding Decentralized Applications (DApps)

A Decentralized Application (DApp) is an application that combines a user-facing frontend with smart contracts deployed on a blockchain.

Unlike traditional applications, where the backend logic usually runs on centralized servers, a DApp can execute its core business logic through smart contracts on a decentralized blockchain network.

A typical DApp consists of two main components:

### 1.1 Backend: Smart Contracts

Smart contracts represent the on-chain logic of a DApp.

They are programs deployed to a blockchain and executed by the blockchain network. They can manage application data, enforce rules, and perform operations according to their implemented functions.

For example, a smart contract might provide functions to:

- Store and retrieve user information.
- Manage token balances.
- Transfer digital assets.
- Execute application-specific business logic.

In our architecture, the smart contract acts as the backend component responsible for the application's blockchain operations.

### 1.2 Frontend: React Application

The frontend is the user-facing part of the DApp.

It provides the interface through which users interact with the application. It can be built using technologies such as React and Next.js.

However, a frontend application cannot directly execute Solidity functions on its own. It needs tools and libraries to communicate with the blockchain and interact with deployed smart contracts.

This is where wallet integration and blockchain interaction libraries become important.

---

## 2. Connecting the Frontend to Smart Contracts

To connect a React application with a smart contract, we need to handle three essential responsibilities:

1. Wallet authentication and connection.
2. Reading data from smart contracts.
3. Writing data to smart contracts.

Our learning stack introduces two important libraries for these responsibilities: **Reown** and **wagmi**.

### 2.1 Reown: Wallet Connection and Authentication

[Reown](https://reown.com/) provides tools for connecting applications to cryptocurrency wallets.

It allows users to connect their wallets to a DApp and establish a wallet-based connection.

A wallet connection is important because it allows the application to identify the connected wallet address and prepare the user to interact with blockchain networks.

Typical wallet connection flow:

1. The user opens the DApp.
2. The user selects the wallet connection option.
3. The wallet connection interface allows the user to choose a supported wallet.
4. The user approves the connection from their wallet.
5. The frontend receives the connected wallet information.

**Important distinction:** Connecting a wallet is not the same as signing a message or authenticating a user through a complete authentication protocol. Wallet connection provides access to the connected account; additional verification may be required when an application needs to prove wallet ownership.

### 2.2 wagmi: Reading and Writing to Smart Contracts

[wagmi](https://wagmi.sh/) is a React library that provides hooks and utilities for interacting with Ethereum-compatible blockchains.

It helps frontend developers connect React components to wallet and blockchain functionality.

In our DApp architecture, wagmi is used for two main operations:

**Reading from a Smart Contract**

Reading means retrieving information from a deployed contract without changing its blockchain state.

Examples include:

- Retrieving a stored counter value.
- Reading token balances.
- Checking contract configuration.
- Retrieving public contract variables.

Read operations generally use blockchain calls that do not require an on-chain transaction or gas payment from the user.

**Writing to a Smart Contract**

Writing means executing a contract function that changes the blockchain state.

Examples include:

- Incrementing a counter.
- Transferring tokens.
- Depositing funds.
- Updating stored contract information.

Write operations require a transaction to be submitted to the blockchain. The connected wallet is typically used to request the user's approval and sign the transaction.

### 2.3 The Role of Each Tool

| Responsibility | Technology |
|---|---|
| Wallet connection | Reown |
| Smart contract reads | wagmi |
| Smart contract writes | wagmi |
| Frontend framework | React / Next.js |
| Smart contract language | Solidity |
| Smart contract development | Foundry |

The important idea is that each technology has a specific responsibility. Reown helps establish the wallet connection, while wagmi provides the React tools needed to interact with the blockchain and smart contracts.

---

## 3. Cryptocurrency Wallet Setup

A cryptocurrency wallet is an essential component of most DApps because it allows users to manage blockchain accounts and approve transactions.

During this lesson, we reviewed the wallet setup process, including:

- Installing MetaMask.
- Creating or importing a wallet.
- Understanding the wallet interface.
- Selecting a blockchain network.
- Obtaining test ETH for development.

### 3.1 MetaMask

[MetaMask](https://metamask.io/) is a cryptocurrency wallet that allows users to manage blockchain accounts and interact with decentralized applications.

It can be used to:

- Manage wallet accounts.
- View balances and transaction history.
- Connect to DApps.
- Approve and sign transactions.
- Switch between supported networks.

### 3.2 Sepolia Testnet

The Sepolia network is an Ethereum test network used for development and testing.

Instead of deploying and testing contracts with real ETH on Ethereum Mainnet, developers can use Sepolia test ETH to experiment with smart contracts and transactions.

This makes it possible to test application functionality without risking real funds.

**Development reminder:** Always verify that the wallet is connected to the intended network before performing deployment or transaction operations.

---

## 4. Smart Contract Project Setup with Foundry

After reviewing wallet setup, we moved to preparing our smart contract development environment.

We used [Foundry](https://getfoundry.sh/), a development toolkit for building, testing, and deploying Ethereum smart contracts.

Foundry provides several important command-line tools:

| Tool | Purpose |
|---|---|
| `forge` | Build, test, and deploy smart contracts |
| `cast` | Interact with Ethereum networks and accounts |
| `anvil` | Run a local Ethereum development node |
| `chisel` | Solidity interactive shell |

### 4.1 Initializing a Foundry Project

Inside the main repository, we initialized a new Foundry project:

```bash
forge init my-foundry
```

This command creates a Foundry project inside the `my-foundry` directory.

A typical Foundry project contains:

```text
my-foundry/
├── .github/
├── lib/
├── script/
├── src/
├── test/
├── .gitignore
├── .gitmodules
├── foundry.toml
└── README.md
```

Important directories:

- `src/`: Contains Solidity smart contract source files.
- `test/`: Contains automated smart contract tests.
- `script/`: Contains deployment and interaction scripts.
- `lib/`: Contains external dependencies.
- `foundry.toml`: Contains Foundry project configuration.

The `out/` directory is generated during compilation and contains build artifacts.

### 4.2 Understanding the Foundry Git Repository

By default, `forge init` initializes a Git repository inside the new project directory.

However, our project already has a parent Git repository:

```text
fullstack-dapp-journey/
```

We want the Foundry project to remain part of this main repository rather than becoming a separate nested Git repository.

Therefore, before committing our work, we will remove the nested Git metadata:

```bash
rm -rf my-foundry/.git
```

This command removes only the inner Git repository metadata.

It does **not** delete the Foundry project or its source files.

We keep:

- `my-foundry/src/`
- `my-foundry/script/`
- `my-foundry/test/`
- `my-foundry/lib/`
- `my-foundry/foundry.toml`
- `my-foundry/.gitignore`
- Other Foundry configuration and project files.

The result is one Git repository:

```text
fullstack-dapp-journey/
├── .git/
├── day-01/
├── day-02/
├── day-03/
├── day-04/
├── my-app/
└── my-foundry/
    ├── src/
    ├── script/
    ├── test/
    ├── lib/
    └── foundry.toml
```

This keeps the complete learning journey under one Git history and avoids accidentally tracking the Foundry project as a separate repository.

---

## 5. Creating the Counter Smart Contract

We created a Solidity file named `Counter.sol` inside the Foundry `src/` directory:

```text
my-foundry/
└── src/
    └── Counter.sol
```

The contract contains a public counter variable and a function that increments its value.

### 5.1 Counter.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract Counter {
    uint public counter;

    function increment() public {
        counter++;
    }
}
```

### 5.2 Understanding the Contract

**SPDX License Identifier**

```solidity
// SPDX-License-Identifier: MIT
```

Specifies the license associated with the source code. MIT is a permissive open-source license.

**Solidity Version**

```solidity
pragma solidity ^0.8.31;
```

Specifies the Solidity compiler version range accepted by the contract.

**Contract Declaration**

```solidity
contract Counter {
```

Defines a smart contract named `Counter`.

**Public State Variable**

```solidity
uint public counter;
```

Declares an unsigned integer state variable.

The `public` visibility modifier automatically creates a getter function that allows external callers to read its current value.

Because the variable is an unsigned integer, its default initial value is `0`.

**Increment Function**

```solidity
function increment() public {
    counter++;
}
```

Defines a public function that increases the stored counter value by one.

Since this function modifies contract state, calling it through a transaction changes the blockchain state.

### 5.3 Understanding Read and Write Operations in This Contract

Our Counter contract provides a simple example of both types of smart contract interaction.

| Contract Element | Operation | Description |
|---|---|---|
| `counter` | Read | Retrieves the current counter value |
| `increment()` | Write | Increases the counter value by one |

The compiler generates a getter for the public `counter` variable, even though we did not explicitly write a getter function.

This makes the contract a useful starting point for learning frontend-to-smart-contract integration.

---

## 6. Compiling the Smart Contract

Before deploying a smart contract, it must be compiled into bytecode and accompanied by its ABI.

We entered the Foundry project directory:

```bash
cd my-foundry
```

Then ran:

```bash
forge build
```

The `forge build` command compiles the Solidity source files using the compiler version and configuration defined by the project.

Compilation generates build artifacts inside:

```text
my-foundry/
└── out/
    └── Counter.sol/
        └── Counter.json
```

The generated `Counter.json` artifact contains information about the compiled contract, including its ABI and compiled bytecode.

### 6.1 What Is an ABI?

ABI stands for **Application Binary Interface**.

It describes how external applications can interact with a smart contract.

The ABI contains information about the contract's externally accessible interface, including:

- Function names.
- Function inputs and outputs.
- Function visibility and mutability information.
- Events and other supported interface definitions.

The ABI allows frontend libraries to understand how to encode function calls and decode their results.

Without the correct ABI, a frontend application cannot reliably construct calls to the contract's functions.

### 6.2 Counter Contract ABI

The relevant ABI generated for our Counter contract is:

```json
{
  "abi": [
    {
      "type": "function",
      "name": "counter",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "increment",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ]
}
```

This ABI describes two callable functions:

**`counter()`**

- Takes no arguments.
- Returns a `uint256`.
- Has `view` mutability.
- Reads the current counter value without modifying contract state.

**`increment()`**

- Takes no arguments.
- Returns no values.
- Has `nonpayable` mutability.
- Modifies the counter state and must be executed through a transaction when called on-chain.

The `view` and `nonpayable` properties help frontend libraries determine how to interact with each function.

---

## 7. Preparing the Deployment Environment

After compiling the contract, we prepared the environment needed to deploy it to Sepolia.

We used:

- Foundry's `forge` command.
- Foundry's `cast` wallet management.
- An RPC endpoint for Sepolia.
- A Makefile to simplify the deployment command.
- An environment file to keep sensitive configuration outside the source code.

### 7.1 Managing Wallet Accounts with Cast

Foundry's `cast` tool supports wallet management and blockchain interaction.

We used the wallet list command:

```bash
cast wallet list
```

The configured local accounts included:

```text
hassanAccount (Local)
hassanKey (Local)
```

The deployment command uses the configured account name:

```bash
--account hassanAccount
```

This allows Foundry to use the selected local wallet account when signing the deployment transaction.

### 7.2 Environment Variables

We created an environment file named `.env` to store deployment configuration.

For example:

```env
RPC_URL=YOUR_SEPOLIA_RPC_URL
```

The RPC URL provides access to a Sepolia node through an RPC provider.

Environment variables help separate configuration and sensitive values from the application source code.

**Security requirements:**

- Never commit `.env` files.
- Never publish private keys or seed phrases.
- Never paste wallet secrets into source code or public documentation.
- Use test accounts and test ETH for testnet development.

### 7.3 Makefile

We created a Makefile to simplify the deployment process.

```makefile
-include .env

deploy:
	forge create Counter --account hassanAccount --rpc-url ${RPC_URL} --broadcast
```

Let's understand its components.

**Including the Environment File**

```makefile
-include .env
```

Loads the variables defined in `.env`.

The leading `-` makes the include optional if the file is unavailable.

**Deployment Target**

```makefile
deploy:
```

Defines a Make target named `deploy`.

**Deployment Command**

```makefile
forge create Counter --account hassanAccount --rpc-url ${RPC_URL} --broadcast
```

- `forge create`: Creates a deployment transaction for a contract.
- `Counter`: Specifies the contract to deploy.
- `--account hassanAccount`: Selects the configured wallet account.
- `--rpc-url ${RPC_URL}`: Specifies the Sepolia RPC endpoint.
- `--broadcast`: Broadcasts the deployment transaction to the network.

We can execute the Make target using:

```bash
make deploy
```

The deployment command compiles the required contract if necessary, creates the deployment transaction, signs it using the selected account, and broadcasts it to the configured network.

---

## 8. Deploying the Contract to Sepolia

With the contract compiled and the deployment environment configured, we deployed the Counter contract to the Sepolia testnet.

The deployment command was:

```bash
make deploy
```

Foundry returned deployment information, including:

- The deployer account.
- The deployed contract address.
- The deployment transaction hash.

### 8.1 Deployed Contract Address

Our Counter contract was deployed to:

```text
0xe7dcbC2bfc47998CDDCb499C73fd761Fb7630537
```

This is the contract's address on the Sepolia network.

The address identifies the deployed contract and tells frontend applications where to send read calls and write transactions.

The same Solidity source code can be deployed multiple times, with each deployment receiving its own contract address.

### 8.2 Deployment Transaction

Deploying a contract is an on-chain transaction.

The deployment transaction contains the contract creation bytecode and is broadcast to the selected blockchain network.

After the transaction is successfully processed, the network creates the contract and assigns it an address.

The contract address is therefore different from the transaction hash:

- **Transaction hash:** Identifies the deployment transaction.
- **Contract address:** Identifies the deployed smart contract.

Both are useful, but they serve different purposes.

---

## 9. The Two Essential Requirements for Frontend Integration

At this stage, we have prepared the two essential pieces of information required to interact with our deployed contract from the frontend.

### 9.1 Contract ABI

The ABI describes the contract's interface and tells the frontend how to interact with its functions.

For our Counter contract, it describes:

- `counter()`
- `increment()`

### 9.2 Contract Address

The contract address identifies the exact deployed contract on the selected blockchain network.

Our deployed address is:

```text
0xe7dcbC2bfc47998CDDCb499C73fd761Fb7630537
```

### 9.3 Why Do We Need Both?

The ABI and contract address have different responsibilities.

| Requirement | Purpose |
|---|---|
| ABI | Describes how to interact with the contract |
| Contract Address | Identifies which deployed contract to interact with |

A useful way to understand the relationship:

- The address tells the application **where** the contract is.
- The ABI tells the application **how** to communicate with it.

Having only one of them is not sufficient for normal ABI-based contract interaction.

### 9.4 How They Fit into the Frontend

When integrating the Counter contract into our React application, the frontend will need to:

1. Connect the user's wallet.
2. Select the correct blockchain network.
3. Load the contract ABI.
4. Use the deployed contract address.
5. Read the counter value.
6. Allow the user to submit an increment transaction.
7. Display the updated value after the blockchain operation is confirmed or the application refreshes its data.

We will use wagmi and the wallet connection setup introduced earlier to build this integration.

---

## 10. Project Structure

Our repository now contains the frontend application and the Foundry smart contract project under the same main repository.

```text
fullstack-dapp-journey/
├── day-01/
├── day-02/
├── day-03/
├── day-04/
├── my-app/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
├── my-foundry/
│   ├── lib/
│   ├── script/
│   ├── src/
│   │   └── Counter.sol
│   ├── test/
│   ├── foundry.toml
│   ├── Makefile
│   └── README.md
├── .gitignore
└── README.md
```

Generated build artifacts such as `out/` and local configuration files such as `.env` should be handled by the appropriate ignore rules.

The parent repository remains the single Git repository for the entire learning journey.

---

## 11. Key Takeaways

By completing this module, we established several important foundations for fullstack DApp development:

- Understood the main components of a decentralized application.
- Identified the responsibilities of the frontend and smart contract backend.
- Learned where Reown fits into wallet connection.
- Learned how wagmi supports smart contract read and write operations.
- Reviewed MetaMask setup and testnet preparation.
- Initialized a Foundry project inside the main learning repository.
- Created a Solidity Counter contract.
- Compiled the contract using `forge build`.
- Understood the role of ABI in frontend integration.
- Prepared a deployment environment using Cast, `.env`, and Makefile.
- Deployed the Counter contract to the Sepolia testnet.
- Obtained the deployed contract address and ABI.

Most importantly, we now have a real deployed smart contract that can serve as the backend for our next frontend integration exercise.

---

## 12. Next Steps

The next stage is to connect our Next.js frontend application to the deployed Counter contract.

We will use the ABI and contract address to:

1. Configure the frontend for the Sepolia network.
2. Connect a user's wallet.
3. Read the current counter value from the contract.
4. Call `increment()` through a wallet-approved transaction.
5. Update the frontend when the contract state changes.

This will be our first practical step toward building a complete DApp where the frontend and blockchain backend work together.

---

## Resources

- [Foundry Documentation](https://getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Reown Documentation](https://docs.reown.com/)
- [wagmi Documentation](https://wagmi.sh/)
- [MetaMask](https://metamask.io/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Ethereum Developer Documentation](https://ethereum.org/developers/)