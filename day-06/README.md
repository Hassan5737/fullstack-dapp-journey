#  Wallet Connection and Smart Contract Interaction

## Overview

This day marks an important milestone in our Fullstack DApp Development journey.

After preparing the frontend environment with Reown AppKit and Wagmi, we moved from configuration to actual Web3 integration.

The main goal was to connect a crypto wallet to our Next.js application and interact with a deployed smart contract directly from the frontend.

We explored how to:

- Connect a wallet using Reown AppKit.
- Switch between supported blockchain networks.
- Write data to a deployed smart contract.
- Read data from a smart contract.
- Detect whether a user is connected.
- Retrieve and display the connected wallet address.

For the practical implementation, we used our Counter smart contract deployed on the Sepolia testnet.

By the end of this day, our frontend could connect to MetaMask, display wallet information, read the contract's counter value, and send a transaction to increment it.

---

## Learning Objectives

After completing this day, you should understand how to:

1. Integrate wallet connection functionality into a Next.js application.
2. Use Reown's wallet and network buttons.
3. Understand the difference between reading and writing to a smart contract.
4. Use Wagmi's `useWriteContract` hook to execute contract functions.
5. Use Wagmi's `useReadContract` hook to retrieve contract data.
6. Refresh contract data using the `refetch` function.
7. Handle loading and error states when reading contract data.
8. Use the `useAccount` hook to retrieve wallet connection information.
9. Display the connected account address.
10. Understand the basic flow of a frontend-to-smart-contract interaction.

---

## 1. Connecting a Wallet

The first step in interacting with a DApp is connecting a crypto wallet.

A wallet allows users to interact with blockchain applications using their accounts. It provides access to account information and allows users to authorize blockchain transactions.

### What Is Wallet Connection?

When a user connects a wallet to a DApp, the application can access the wallet connection information made available by the wallet provider.

This allows the application to identify the connected account and prepare interactions that require user authorization.

It is important to understand that connecting a wallet does not give the application unrestricted access to the user's funds or private keys.

The wallet remains responsible for approving transactions and signing requests.

### Implementing Wallet Connection with Reown

Since we already configured Reown AppKit in the previous day, we can use its built-in components to add wallet connection functionality.

The component used in this lesson is:

```tsx
<w3m-button />
```

This is Reown AppKit's wallet connection button.

It provides a ready-made interface that allows users to open the wallet connection modal.

### How Does It Work?

When the user interacts with the button:

1. Reown AppKit opens its connection interface.
2. The user can choose an available wallet.
3. The user selects MetaMask in our practical example.
4. MetaMask asks the user to approve the connection.
5. Once approved, the wallet becomes connected to the application.

The component also handles the connected state and provides the appropriate wallet interface.

### Adding the Button to a Next.js Component

```tsx
"use client";

export default function Home() {
  return (
    <>
      <w3m-button />
    </>
  );
}
```

Because this component uses interactive browser functionality, it must be rendered within a suitable client-side environment.

In our project, the Reown AppKit setup and provider configuration were already completed in the previous day.

### Important Concepts

- **DApp:** A decentralized application that interacts with blockchain networks.
- **Wallet:** An application or interface that manages blockchain accounts and authorizes transactions.
- **Wallet Connection:** The process through which a user connects an account to a DApp.
- **Reown AppKit:** Provides the wallet connection interface and related functionality.

At this point, our application can establish a wallet connection through Reown AppKit.

---

## 2. Switching Blockchain Networks

After connecting the wallet, the next step is allowing users to switch between supported blockchain networks.

### What Is a Blockchain Network?

A blockchain network is an independent blockchain environment with its own chain identity and state.

For example:

- Ethereum Mainnet
- Sepolia Testnet
- Arbitrum

A smart contract deployed on one network does not automatically exist on another network.

For this reason, the frontend must interact with the same network on which the target contract is deployed.

### Why Do We Need Network Switching?

Imagine that our Counter contract is deployed on Sepolia, but the user's wallet is currently connected to Ethereum Mainnet.

If the frontend attempts to interact with the contract while the wallet is on the wrong network, the interaction may fail or target an unintended address on that network.

Therefore, network selection is an important part of the DApp experience.

### Implementing the Network Button

Reown AppKit provides a built-in component for selecting and switching networks:

```tsx
<w3m-network-button />
```

Add it next to the wallet connection button:

```tsx
"use client";

export default function Home() {
  return (
    <>
      <w3m-button />
      <w3m-network-button />
    </>
  );
}
```

### What Happens When the User Clicks It?

The network button opens the available network selection interface.

The user can select one of the networks configured in the AppKit setup.

For our project, Sepolia is the network we use for interacting with the deployed Counter contract.

### Important: Network Configuration Must Be Consistent

In the previous day, we configured Sepolia in both the Wagmi adapter and Reown AppKit initialization.

The network button uses the configured networks to provide the available network selection experience.

For contract interactions, the selected wallet network must match the network where the contract is deployed.

**Key takeaway:** Wallet connection identifies the user's account, while network selection determines the blockchain environment in which the application operates.

---

## 3. Writing to a Smart Contract

Now that the wallet can connect and the user can select a network, we can start interacting with an actual smart contract.

The first type of interaction is writing data to a contract.

### Understanding Our Counter Smart Contract

In our previous Foundry work, we created and deployed a simple Counter contract.

Here is the Solidity implementation:

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

Let's understand its functionality.

#### The Counter Variable

```solidity
uint public counter;
```

This declares a public unsigned integer variable named `counter`.

Because it is declared as `public`, Solidity automatically generates a getter function that allows external callers to read its current value.

Conceptually, the generated getter behaves like:

```solidity
function counter() public view returns (uint) {
    return counter;
}
```

We do not need to implement this getter manually.

#### The Increment Function

```solidity
function increment() public {
    counter++;
}
```

This function increases the counter value by one.

Every time the function executes successfully, the stored counter value is updated.

Since this function changes the contract's state, calling it requires a blockchain transaction.

### What Does Writing to a Contract Mean?

Writing to a smart contract means executing a function that changes the contract's state.

Examples include:

- Updating a stored value.
- Transferring tokens.
- Creating a new record.
- Changing ownership.
- Executing a business operation.

Unlike reading public data, writing to a contract generally requires a transaction that must be signed and submitted to the blockchain.

### Understanding the ABI

To interact with a deployed smart contract, the frontend needs its address and ABI.

**Contract Address**

The contract address identifies the deployed contract on a particular blockchain network.

Our Counter contract address:

```text
0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241
```

This address is network-specific. It identifies the contract deployment on Sepolia.

**ABI (Application Binary Interface)**

The ABI describes the contract's externally accessible functions and their interfaces.

It tells the frontend:

- Function names.
- Input parameters.
- Output values.
- Function mutability.

For our Counter contract, the relevant ABI entries are:

```json
[
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
```

Notice that:

- `counter` is a `view` function because it reads contract state without modifying it.
- `increment` is a `nonpayable` function because it modifies contract state and does not accept Ether.

The ABI allows libraries such as Viem and Wagmi to encode function calls and interpret their results.

### Using Wagmi's useWriteContract Hook

Wagmi provides the `useWriteContract` hook for executing contract write operations.

```tsx
import { useWriteContract } from "wagmi";
```

Inside the component:

```tsx
const { writeContract } = useWriteContract();
```

The hook returns `writeContract`, which we can use to submit a contract interaction.

### Creating the Increment Handler

```tsx
const handleIncrement = () => {
  writeContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi: [
      {
        type: "function",
        name: "counter",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "increment",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      }
    ],
    functionName: "increment",
    args: []
  });
};
```

Let's understand each property.

| Property | Purpose |
|---|---|
| `address` | The address of the deployed smart contract. |
| `abi` | Describes the contract's available functions and their interfaces. |
| `functionName` | Specifies the function we want to execute. |
| `args` | Contains the arguments passed to that function. |

Our `increment` function does not accept parameters, so we provide an empty array.

### Adding the Increment Button

```tsx
<button onClick={handleIncrement}>
  Increment
</button>
```

When the user clicks the button, `handleIncrement` executes and calls `writeContract`.

### Complete Write Interaction

```tsx
"use client";

import { useWriteContract } from "wagmi";

export default function Home() {
  const { writeContract } = useWriteContract();

  const handleIncrement = () => {
    writeContract({
      address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
      abi: [
        {
          type: "function",
          name: "counter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256"
            }
          ],
          stateMutability: "view"
        },
        {
          type: "function",
          name: "increment",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable"
        }
      ],
      functionName: "increment",
      args: []
    });
  };

  return (
    <>
      <w3m-button />
      <w3m-network-button />

      <button onClick={handleIncrement}>
        Increment
      </button>
    </>
  );
}
```

### What Happens During a Write Operation?

The general transaction flow looks like this:

1. The user clicks the Increment button.
2. The frontend calls `writeContract`.
3. Wagmi and Viem prepare the contract interaction.
4. The wallet is asked to authorize and sign the transaction.
5. The user approves the transaction.
6. The signed transaction is submitted to the blockchain.
7. The network processes the transaction.
8. If execution succeeds, the contract state is updated.

**Important distinction:** Calling `writeContract` initiates the write operation. It does not by itself mean that the transaction has already been confirmed. A production application should also handle the returned transaction hash, pending state, transaction errors, and receipt confirmation.

### Why Does Writing Require Gas?

A state-changing transaction requires blockchain execution.

The user generally pays a transaction fee, commonly called gas, to have the transaction processed.

On Sepolia, the transaction uses test ETH rather than real ETH.

---

## 4. Reading Data from a Smart Contract

After learning how to write to a contract, we moved on to reading its data.

Reading allows the frontend to display information stored on the blockchain without modifying the contract's state.

### What Does Reading Mean?

A read operation retrieves information from a smart contract.

Examples include:

- Reading a token balance.
- Retrieving the owner of a contract.
- Checking a stored value.
- Reading the current counter value.

Our Counter contract exposes a public variable:

```solidity
uint public counter;
```

Solidity automatically generates a getter function named `counter()`.

This allows the frontend to retrieve the current value.

### Using Wagmi's useReadContract Hook

Wagmi provides the `useReadContract` hook to read data from smart contracts.

```tsx
import { useReadContract } from "wagmi";
```

Inside the component:

```tsx
const { data, isPending, refetch, error } = useReadContract({
  address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
  abi: [
    {
      type: "function",
      name: "counter",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256"
        }
      ],
      stateMutability: "view"
    },
    {
      type: "function",
      name: "increment",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable"
    }
  ],
  functionName: "counter",
  args: []
});
```

Let's understand the returned properties.

| Property | Purpose |
|---|---|
| `data` | Contains the result returned by the contract read. |
| `isPending` | Indicates that the query is still waiting for its initial result. |
| `refetch` | Allows us to manually execute the read query again. |
| `error` | Contains information about an error if the read operation fails. |

### Understanding the Configuration

The configuration is similar to the write operation.

We provide:

- The contract address.
- The contract ABI.
- The function name.
- The function arguments.

However, instead of calling `increment`, we call:

```tsx
functionName: "counter"
```

This tells Wagmi to execute the generated getter function and retrieve the stored counter value.

### Displaying the Contract Data

We can display the returned value directly in our React component:

```tsx
<div>
  Counter value: {isPending ? "Loading..." : data?.toString()}
</div>
```

The `data` property contains the returned value.

Because Solidity's `uint256` values are represented as JavaScript `bigint` values by Viem, using `.toString()` is a convenient way to display the value in the interface.

We also check `isPending` to display a loading message while the initial read is still pending.

### Manually Refreshing Contract Data with refetch

We can use the returned `refetch` function to execute the read operation again.

```tsx
const handleGetCounter = async () => {
  await refetch();
};
```

Then add a button:

```tsx
<button onClick={handleGetCounter}>
  Get Counter
</button>
```

When the user clicks this button, the application requests the latest counter value again.

This is useful when the contract state may have changed after the initial read.

For example, after submitting an Increment transaction, the application can refetch the counter to retrieve its updated value.

### Handling Read Errors

We can display an error message if the read operation fails.

```tsx
{error ? (
  <div>
    {((error as unknown) as BaseError).shortMessage}
  </div>
) : null}
```

The error object may contain useful information about why the read failed.

Examples include:

- Incorrect contract address.
- Wrong network.
- Invalid ABI.
- Contract function execution failure.
- RPC or network connectivity problems.

The `BaseError` type from Wagmi/Viem provides structured error information. The example uses a TypeScript assertion to access `shortMessage`.

In production applications, errors should be handled carefully because not every error necessarily contains a useful `shortMessage`.

### Complete Read and Write Interaction

At this stage, our component can both read from and write to the Counter contract.

```tsx
"use client";

import {
  type BaseError,
  useWriteContract,
  useReadContract
} from "wagmi";

export default function Home() {
  const { writeContract } = useWriteContract();

  const handleIncrement = () => {
    writeContract({
      address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
      abi: [
        {
          type: "function",
          name: "counter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256"
            }
          ],
          stateMutability: "view"
        },
        {
          type: "function",
          name: "increment",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable"
        }
      ],
      functionName: "increment",
      args: []
    });
  };

  const {
    data,
    isPending,
    refetch,
    error
  } = useReadContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi: [
      {
        type: "function",
        name: "counter",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "increment",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      }
    ],
    functionName: "counter",
    args: []
  });

  const handleGetCounter = async () => {
    await refetch();
  };

  return (
    <>
      <w3m-button />
      <w3m-network-button />

      <button onClick={handleIncrement}>
        Increment
      </button>

      <div>
        Counter value: {isPending ? "Loading..." : data?.toString()}
      </div>

      <button onClick={handleGetCounter}>
        Get Counter
      </button>

      {error ? (
        <div>
          {((error as unknown) as BaseError).shortMessage}
        </div>
      ) : null}
    </>
  );
}
```

### Understanding the Difference Between Read and Write

This is one of the most important concepts in frontend blockchain development.

| Comparison | Read Operation | Write Operation |
|---|---|---|
| Purpose | Retrieve contract data | Change contract state |
| Wagmi Hook | `useReadContract` | `useWriteContract` |
| Example | `counter()` | `increment()` |
| Changes blockchain state? | No | Yes |
| Requires a transaction? | No | Yes |
| Requires user transaction approval? | No | Usually yes |
| Gas paid by the user? | No, for a normal public read | Yes, for a successful state-changing transaction |

A normal `view` function can be called through an RPC provider without submitting a transaction.

A state-changing function requires a transaction to be signed and submitted.

**Remember:** Reading data and writing data are fundamentally different operations, even though both use the contract's address and ABI.

---

## 5. Checking Whether a User Is Connected and Retrieving the Wallet Address

After implementing wallet connection and contract interactions, we added functionality to detect the user's connection status and retrieve the connected account address.

This is important because a DApp often needs to change its interface depending on whether a wallet is connected.

For example:

- Show a connection prompt when the user is disconnected.
- Display the wallet address when connected.
- Allow transaction buttons to be used only when a wallet is available.
- Show account-specific information.

### Using Wagmi's useAccount Hook

Wagmi provides the `useAccount` hook to access the current account information.

```tsx
import { useAccount } from "wagmi";
```

Inside the component:

```tsx
const { isConnected, address } = useAccount();
```

The hook provides several account-related properties.

For our implementation, we focused on two:

| Property | Purpose |
|---|---|
| `isConnected` | Indicates whether an account is currently connected. |
| `address` | Contains the connected wallet address when available. |

### Checking the Connection Status

We can use `isConnected` to conditionally render different content.

```tsx
{isConnected ? (
  <div>
    Connected: {address}
  </div>
) : (
  "Not Connected"
)}
```

This is a common React conditional rendering pattern.

The expression checks the value of `isConnected`.

- If it is `true`, the application displays the connected wallet address.
- If it is `false`, the application displays `Not Connected`.

### Why Is This Useful?

A DApp should be aware of the user's wallet state.

For example, displaying a connected wallet address provides useful feedback and helps users understand which account they are interacting with.

It also allows the interface to respond to changes in connection status.

When the user connects or disconnects a wallet, Wagmi updates the relevant account state, and React can re-render the component with the new information.

### Understanding useEffect in the Lesson

The tutorial also included:

```tsx
useEffect(() => {}, [isConnected]);
```

This demonstrates the dependency array concept: the effect is scheduled when `isConnected` changes.

However, the callback is empty, so this particular effect does not perform any useful operation.

In a real application, an effect should only be added when there is a side effect to perform in response to a connection change. For displaying the connected state, `useAccount` and React rendering are sufficient.

---

## 6. Complete DApp Interaction Component

After combining the previous lessons, our component supports:

- Wallet connection.
- Network selection.
- Smart contract write operations.
- Smart contract read operations.
- Manual data refresh.
- Read error display.
- Wallet connection status.
- Connected account address display.

The complete implementation is:

```tsx
"use client";

import React from "react";

import {
  type BaseError,
  useWriteContract,
  useReadContract,
  useAccount
} from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();

  const { writeContract } = useWriteContract();

  const handleIncrement = () => {
    writeContract({
      address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
      abi: [
        {
          type: "function",
          name: "counter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256"
            }
          ],
          stateMutability: "view"
        },
        {
          type: "function",
          name: "increment",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable"
        }
      ],
      functionName: "increment",
      args: []
    });
  };

  const {
    data,
    isPending,
    refetch,
    error
  } = useReadContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi: [
      {
        type: "function",
        name: "counter",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256"
          }
        ],
        stateMutability: "view"
      },
      {
        type: "function",
        name: "increment",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
      }
    ],
    functionName: "counter",
    args: []
  });

  const handleGetCounter = async () => {
    await refetch();
  };

  return (
    <>
      <w3m-button />

      <w3m-network-button />

      <button onClick={handleIncrement}>
        Increment
      </button>

      <div>
        Counter value: {isPending ? "Loading..." : data?.toString()}
      </div>

      <button onClick={handleGetCounter}>
        Get Counter
      </button>

      {error ? (
        <div>
          {((error as unknown) as BaseError).shortMessage}
        </div>
      ) : null}

      {isConnected ? (
        <div>
          Connected: {address}
        </div>
      ) : (
        "Not Connected"
      )}
    </>
  );
}
```

This component brings together the main concepts covered throughout the day.

It is a practical example of how a frontend application can communicate with a deployed smart contract while responding to the user's wallet state.

---

## 7. Understanding the Complete Frontend-to-Blockchain Flow

Now that we have implemented all the features, let's connect the individual steps into one complete workflow.

### Wallet Connection Flow

```text
User
  |
  v
Reown AppKit Button
  |
  v
Wallet Selection
  |
  v
MetaMask
  |
  v
User Approves Connection
  |
  v
Wagmi Account State
  |
  v
Connected Wallet Address
```

### Network Switching Flow

```text
User
  |
  v
Reown Network Button
  |
  v
Available Networks
  |
  v
User Selects Sepolia
  |
  v
Wallet Network Changes
  |
  v
Application Uses Selected Network
```

### Smart Contract Write Flow

```text
User Clicks Increment
        |
        v
handleIncrement()
        |
        v
useWriteContract()
        |
        v
Contract Address + ABI
        |
        v
increment()
        |
        v
Wallet Requests Approval
        |
        v
User Signs Transaction
        |
        v
Transaction Submitted
        |
        v
Sepolia Executes Transaction
        |
        v
Contract State Updated
```

### Smart Contract Read Flow

```text
Frontend
   |
   v
useReadContract()
   |
   v
Contract Address + ABI
   |
   v
counter()
   |
   v
RPC Request
   |
   v
Sepolia Network
   |
   v
Contract Returns Data
   |
   v
Wagmi Receives Result
   |
   v
React Displays Counter Value
```

These workflows show how Reown, Wagmi, Viem, the wallet, and the blockchain work together.

---

## 8. Important Considerations for Real-World DApps

The examples in this day are designed to explain the core integration concepts. Real applications require additional handling.

### 1. Keep the Contract Address and Network Consistent

The contract address is specific to its deployment network.

Always make sure that:

- The configured network is the intended network.
- The connected wallet is on the correct network.
- The contract address belongs to that network.
- The ABI matches the deployed contract.

Using the correct address on the wrong network does not guarantee that the expected contract exists there.

### 2. Handle Transaction States

A production application should provide feedback during the transaction lifecycle.

Useful states include:

- Waiting for wallet approval.
- Transaction submitted.
- Transaction pending.
- Transaction confirmed.
- Transaction failed.

Wagmi provides additional hooks for tracking transaction hashes and waiting for transaction receipts.

Calling `writeContract` alone does not provide a complete transaction confirmation workflow.

### 3. Refresh Data After Successful Writes

After a successful transaction, the frontend may need to retrieve the updated contract state.

One approach is to call `refetch` after the transaction has been confirmed.

This ensures that the displayed value reflects the latest contract state rather than relying on the previously fetched result.

### 4. Do Not Expose Private Keys

The frontend should never contain wallet private keys or deployment private keys.

Wallet signing should be handled through the user's wallet provider.

### 5. Avoid Duplicating ABI Definitions

For learning purposes, we included the ABI directly inside the component.

As the application grows, keeping the ABI in a separate module makes the code easier to maintain and reuse.

For example:

```text
my-app/
├── contracts/
│   └── Counter.json
├── components/
├── config/
├── context/
└── app/
```

The frontend can then import the contract ABI from the dedicated location.

### 6. Add User-Friendly Error Handling

A production DApp should handle situations such as:

- The user rejects a wallet connection.
- The user rejects a transaction.
- The wallet is connected to an unsupported network.
- The contract call reverts.
- The RPC provider is unavailable.
- The transaction runs out of gas.

Clear feedback makes the application more reliable and easier to use.

---

## 9. Final Project Structure

The relevant project structure after this day looks like:

```text
fullstack-dapp-journey/
├── day-01/
│   └── README.md
├── day-02/
│   └── README.md
├── day-03/
│   └── README.md
├── day-04/
│   └── README.md
├── day-05/
│   └── README.md
├── day-06/
│   └── README.md
│
├── my-app/
│   ├── app/
│   │   ├── about/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── counter.tsx
│   ├── config/
│   │   └── index.tsx
│   ├── context/
│   │   └── index.tsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── ...
│
└── my-foundry/
    ├── src/
    ├── test/
    ├── script/
    └── ...
```

The `.env` file is shown for structural reference only and must remain excluded from Git.

---

## 10. Key Takeaways

This day moved our project from initial Web3 configuration to actual smart contract interaction.

We learned that a complete DApp frontend needs to handle several connected responsibilities:

- Reown AppKit provides the wallet connection interface.
- Wagmi provides React hooks for account management and contract interaction.
- Viem provides the underlying Ethereum interaction utilities.
- The wallet authorizes and signs transactions.
- The blockchain executes transactions and stores the updated contract state.
- Read operations retrieve blockchain data without submitting state-changing transactions.
- React updates the interface based on the latest application and wallet state.

Most importantly, we now understand the fundamental difference between reading from a smart contract and writing to it.

We successfully connected the frontend to a deployed Counter contract on Sepolia, retrieved its stored value, and prepared a transaction to increment it.

This is an essential step toward building complete Fullstack DApps where the frontend provides the user experience and smart contracts handle decentralized application logic.

---

## Resources

- [Reown Documentation](https://docs.reown.com/)
- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh/)
- [Wagmi useAccount](https://wagmi.sh/react/api/hooks/useAccount)
- [Wagmi useWriteContract](https://wagmi.sh/react/api/hooks/useWriteContract)
- [Wagmi useReadContract](https://wagmi.sh/react/api/hooks/useReadContract)
- [Viem Documentation](https://viem.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)

---
