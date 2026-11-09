# Finalization and Code Refactoring

## Overview

This day marks the finalization of the fourth course in our Fullstack DApp Development journey.

After successfully connecting our Next.js frontend to a deployed smart contract, implementing wallet connection, switching networks, and performing read and write operations, we focused on improving the structure and maintainability of our code.

The main goal was to move beyond simply making the application work and start organizing it in a way that makes future development easier.

We explored the JavaScript Spread Operator and used it to avoid repeating contract configuration across multiple interactions. Then, we refactored the application by separating contract configurations and reusable interaction logic into dedicated files.

We also connected this refactoring process to the SOLID principles, with particular focus on the Open/Closed Principle.

By the end of this day, we had a cleaner structure for managing contract configurations and reusing contract write operations.

---

## Learning Objectives

After completing this day, you should understand how to:

1. Use the JavaScript Spread Operator with objects.
2. Reuse object properties without manually copying them.
3. Avoid repeating contract addresses and ABIs across multiple interactions.
4. Separate contract configuration from application components.
5. Move reusable functions into utility modules.
6. Use `keyof typeof` to derive valid object keys in TypeScript.
7. Understand the purpose of code refactoring.
8. Understand the Open/Closed Principle from SOLID.
9. Organize frontend blockchain code for easier maintenance and extension.

---

## 1. The Spread Operator

The first topic covered in this lesson was the JavaScript Spread Operator.

The Spread Operator is represented by three dots:

```ts
...
```

It allows us to expand the properties of an iterable or object into another structure.

In our implementation, we focused on using it with objects.

### Understanding the Problem

Before introducing the Spread Operator, our contract address and ABI were written directly inside the configuration of each contract interaction.

For example, when writing to a smart contract, we needed to provide:

```tsx
writeContract({
  address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
  abi: [
    // Contract ABI
  ],
  functionName: "increment",
  args: [],
});
```

The same contract address and ABI were also required when reading from the contract.

This created unnecessary repetition.

If we had multiple functions or contracts, we would have to maintain the same configuration in several places.

This makes the code harder to maintain because changing a contract address or ABI would require updating every occurrence.

### Understanding Object Spread

The Spread Operator allows us to reuse the properties of an existing object inside another object.

Consider this example:

```ts
const contractConfig = {
  address: "0x123",
  abi: [],
};

const interactionConfig = {
  ...contractConfig,
  functionName: "increment",
};
```

The expression:

```ts
...contractConfig
```

expands the properties of `contractConfig` into the new object.

Conceptually, the resulting object contains:

```ts
{
  address: "0x123",
  abi: [],
  functionName: "increment",
}
```

We can then add new properties or override existing properties in the new object.

### Why Is This Useful?

The Spread Operator helps us:

- Reuse existing object properties.
- Avoid repeating configuration.
- Combine multiple objects.
- Create new objects based on existing ones.
- Keep related configuration in one place.

In our DApp, this means we can define the contract address and ABI once, then reuse them whenever we interact with that contract.

---

## 2. Centralizing the Smart Contract Configuration

After understanding the Spread Operator, we applied it to our DApp.

Instead of writing the contract address and ABI inside every function, we created one configuration object.

### The Original Configuration

Initially, we defined the configuration directly inside `page.tsx`:

```tsx
const wagmiContractConfig = {
  address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241" as const,
  abi: [
    {
      type: "function",
      name: "counter",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "increment",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],
};
```

We could then reuse this object with the Spread Operator.

### Using the Configuration with writeContract

```tsx
const handleIncrement = () => {
  writeContract({
    ...wagmiContractConfig,
    functionName: "increment",
  });
};
```

The Spread Operator expands the address and ABI into the configuration passed to `writeContract`.

We only need to provide the properties specific to the current interaction, such as `functionName`.

### Using the Configuration with useReadContract

We can apply the same idea when reading from the contract:

```tsx
const { data, isPending, refetch, error } = useReadContract({
  ...wagmiContractConfig,
  functionName: "counter",
});
```

Both operations now reuse the same contract configuration.

### The Main Benefit

Instead of maintaining the same address and ABI in multiple places, we maintain one configuration object.

This makes the code:

- Less repetitive.
- Easier to update.
- Easier to read.
- More consistent across contract interactions.

---

## 3. Refactoring the Application

After learning how to reuse the contract configuration, we moved on to refactoring the application.

### What Is Refactoring?

Refactoring is the process of improving the internal structure of existing code without changing its external behavior.

The goal is not necessarily to add new features.

Instead, we improve how the code is organized so that it becomes easier to understand, maintain, test, and extend.

For example, we may:

- Extract repeated code into reusable functions.
- Move configuration into dedicated files.
- Separate responsibilities between modules.
- Reduce unnecessary duplication.
- Make components easier to read.

In our project, the main issue was that `page.tsx` was responsible for too many things.

It contained:

- Wallet account information.
- Contract configuration.
- Contract write logic.
- Contract read logic.
- Event handlers.
- User interface rendering.

As the application grows, keeping everything inside one component can make the code difficult to maintain.

We therefore started separating responsibilities.

### Refactoring Goals

Our refactoring focused on two main improvements:

1. Moving contract configuration into a dedicated file.
2. Moving reusable contract write logic into a utility file.

This gives each file a clearer responsibility.

---

## 4. Separating Contract Configuration

The first refactoring step was moving the contract configuration into its own file.

We created:

```text
my-app/
└── app/
    ├── contractsUtils.ts
    ├── page.tsx
    └── utils.ts
```

The file `contractsUtils.ts` is responsible for storing the configurations of the smart contracts used by the frontend.

### contractsUtils.ts

```ts
export const wagmiContractConfig = {
  dapp: {
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241" as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "counter",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "increment",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
  },

  // otherContract: {
  //   address: "0x...",
  //   abi: [],
  // },
};
```

### Understanding the Configuration Structure

Instead of storing the address and ABI directly at the top level, we placed them inside a property named `dapp`.

This gives us a structure that can support multiple contract configurations.

For example:

```ts
const wagmiContractConfig = {
  dapp: {
    address: "0x...",
    abi: [],
  },

  anotherContract: {
    address: "0x...",
    abi: [],
  },
};
```

Each property represents a contract configuration.

This organization allows us to identify a contract by its name and retrieve its corresponding address and ABI.

### Understanding the Address Type

We used:

```ts
address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241" as `0x${string}`,
```

This is a TypeScript type assertion.

It tells TypeScript to treat the address as a hexadecimal string type compatible with the address format used by Viem.

It does not validate the address at runtime. It is a compile-time type assertion.

### Importing the Configuration

After moving the configuration, we imported it into `page.tsx`:

```tsx
import { wagmiContractConfig } from "./contractsUtils";
```

Now the page component can access the configuration without defining it again.

---

## 5. Creating a Reusable Contract Write Utility

The next step was separating the contract write logic from the page component.

We created a reusable function inside:

```text
my-app/app/utils.ts
```

### utils.ts

```ts
import { wagmiContractConfig } from "./contractsUtils";

export const writeToContract = (
  writeContract: any,
  contractName: keyof typeof wagmiContractConfig,
  functionName: string
) => {
  writeContract({
    ...wagmiContractConfig[contractName],
    functionName,
  });
};
```

This function receives three parameters:

| Parameter | Purpose |
|---|---|
| `writeContract` | The contract-writing function returned by Wagmi's `useWriteContract` hook. |
| `contractName` | The name of the contract configuration we want to use. |
| `functionName` | The name of the smart contract function we want to execute. |

### Understanding the Function

First, we retrieve the selected contract configuration:

```ts
wagmiContractConfig[contractName]
```

For example, if:

```ts
contractName = "dapp";
```

Then:

```ts
wagmiContractConfig[contractName]
```

is equivalent to:

```ts
wagmiContractConfig.dapp
```

Next, we use the Spread Operator:

```ts
writeContract({
  ...wagmiContractConfig[contractName],
  functionName,
});
```

This expands the selected contract's address and ABI into the object passed to `writeContract`.

We then add the requested function name.

The resulting configuration contains the selected contract's address, ABI, and the function that we want to call.

### Understanding keyof typeof

One important TypeScript concept used in this function is:

```ts
keyof typeof wagmiContractConfig
```

Let's break it down.

#### typeof

In TypeScript, `typeof` can be used in a type position to obtain the type of an existing variable.

For example:

```ts
const user = {
  name: "Hassan",
  age: 25,
};
```

We can obtain the type of this object using:

```ts
type User = typeof user;
```

The resulting type is equivalent to:

```ts
type User = {
  name: string;
  age: number;
};
```

#### keyof

The `keyof` operator extracts the property names of an object type and creates a union of those keys.

For example:

```ts
type UserKeys = keyof User;
```

The resulting type is:

```ts
type UserKeys = "name" | "age";
```

#### Combining keyof and typeof

In our configuration:

```ts
keyof typeof wagmiContractConfig
```

extracts the available contract configuration names.

Since our object currently contains the `dapp` property, the resulting type is:

```ts
type ContractName = "dapp";
```

If we later add another contract:

```ts
export const wagmiContractConfig = {
  dapp: {
    address: "0x...",
    abi: [],
  },

  token: {
    address: "0x...",
    abi: [],
  },
};
```

The type will automatically become:

```ts
type ContractName = "dapp" | "token";
```

This means TypeScript can restrict the `contractName` argument to keys that actually exist in our configuration object.

It also means that adding a new contract configuration automatically updates the available contract names without manually maintaining a separate union type.

---

## 6. Updating page.tsx to Use the Utility

After extracting the configuration and reusable write function, we updated `page.tsx`.

Instead of defining the entire write operation inside the component, we imported the utility:

```tsx
import { writeToContract } from "./utils";
```

The component can now call the reusable function directly.

### Using the Utility

```tsx
<button
  onClick={() => writeToContract(writeContract, "dapp", "increment")}
>
  Increment
</button>
```

Let's understand what happens here:

1. The user clicks the Increment button.
2. The event handler calls `writeToContract`.
3. The function receives the Wagmi `writeContract` function.
4. It receives `"dapp"` as the selected contract name.
5. It receives `"increment"` as the requested function name.
6. It retrieves the configuration from `wagmiContractConfig.dapp`.
7. It spreads the address and ABI into the configuration.
8. It calls Wagmi's `writeContract` function.

The page component no longer needs to know the internal details of how the contract configuration is assembled.

It only needs to specify which contract and which function it wants to use.

### Updated page.tsx

The relevant structure after the refactoring looks like this:

```tsx
"use client";

import React, { useEffect } from "react";
import { useWriteContract, useAccount } from "wagmi";

import { writeToContract } from "./utils";

export default function Home() {
  const { isConnected, address } = useAccount();

  useEffect(() => {}, [isConnected]);

  const { writeContract } = useWriteContract();

  return (
    <>
      <w3m-button />
      <w3m-network-button />

      <button
        onClick={() =>
          writeToContract(writeContract, "dapp", "increment")
        }
      >
        Increment
      </button>

      {isConnected ? (
        <div>Connected: {address}</div>
      ) : (
        "Not Connected"
      )}
    </>
  );
}
```

The read operation was commented out in this lesson while the refactoring focused on the write interaction.

The previous read implementation using `useReadContract` was not removed from the learning history; it was simply not part of the active code shown in this refactoring step.

---

## 7. Understanding the SOLID Principles

During the refactoring lesson, we connected the improvements to the SOLID principles.

SOLID is a set of five object-oriented design principles that help developers build software that is easier to maintain, extend, and understand.

The five principles are:

| Principle | Meaning |
|---|---|
| Single Responsibility Principle (SRP) | A module should have one clear responsibility. |
| Open/Closed Principle (OCP) | Software entities should be open for extension but closed for modification. |
| Liskov Substitution Principle (LSP) | Objects of a subtype should be usable wherever objects of their base type are expected without breaking correctness. |
| Interface Segregation Principle (ISP) | Clients should not be forced to depend on interfaces they do not use. |
| Dependency Inversion Principle (DIP) | High-level modules should depend on abstractions rather than concrete implementations. |

In this lesson, our main focus was the Open/Closed Principle.

---

## 8. Open/Closed Principle (OCP)

The Open/Closed Principle states:

> Software entities should be open for extension but closed for modification.

This means that we should design our code so that we can add new functionality without repeatedly changing existing, working code.

### Understanding the Principle

Imagine that we have a function responsible for interacting with a smart contract.

If every new contract requires us to rewrite the function, the implementation becomes difficult to extend.

Instead, we can make the function generic enough to work with different contract configurations.

This is what we attempted to achieve with our `writeToContract` utility.

### Before Refactoring

The write operation was tied directly to one contract:

```tsx
const handleIncrement = () => {
  writeContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi: [
      // Contract ABI
    ],
    functionName: "increment",
    args: [],
  });
};
```

If we wanted to interact with another contract, we would need to write another handler or duplicate much of this configuration.

### After Refactoring

We created a reusable function:

```ts
export const writeToContract = (
  writeContract: any,
  contractName: keyof typeof wagmiContractConfig,
  functionName: string
) => {
  writeContract({
    ...wagmiContractConfig[contractName],
    functionName,
  });
};
```

Now the calling code can specify the contract and function:

```tsx
writeToContract(writeContract, "dapp", "increment");
```

If we add another contract configuration:

```ts
export const wagmiContractConfig = {
  dapp: {
    address: "0x...",
    abi: [],
  },

  token: {
    address: "0x...",
    abi: [],
  },
};
```

We can select it using the same utility:

```tsx
writeToContract(writeContract, "token", "transfer");
```

The existing utility function does not need to be rewritten simply because a new contract configuration was added.

### How Does This Relate to OCP?

Our implementation demonstrates the idea of extension through configuration.

We can extend the configuration object with additional contracts and reuse the existing write utility to select them.

The reusable function provides a common interaction path instead of requiring a separate implementation for every contract.

This is the main design improvement we explored in the lesson.

### An Important Design Consideration

The current implementation is a learning example, not a fully type-safe contract interaction abstraction.

For example:

```ts
functionName: string
```

allows any string to be passed as a function name.

It does not guarantee that the selected contract actually contains that function.

Also:

```ts
writeContract: any
```

removes much of TypeScript's type checking for the Wagmi function.

A more advanced implementation could use contract-specific ABI types and generic TypeScript types to validate function names and arguments.

The important point is that the current refactoring demonstrates reusable configuration and extension through a common utility, while stronger typing can be introduced as the application evolves.

---

## 9. Understanding the Final Code Organization

After the refactoring, the relevant application structure looks like this:

```text
my-app/
└── app/
    ├── contractsUtils.ts
    ├── page.tsx
    └── utils.ts
```

Each file has a more focused responsibility.

### contractsUtils.ts

Responsible for:

- Storing contract addresses.
- Storing contract ABIs.
- Organizing multiple contract configurations.
- Providing a central source for contract configuration.

### utils.ts

Responsible for:

- Providing reusable contract write logic.
- Selecting a contract configuration by name.
- Combining contract configuration with the requested function name.
- Calling the supplied Wagmi write function.

### page.tsx

Responsible for:

- Rendering the DApp interface.
- Displaying wallet connection components.
- Reading wallet connection information.
- Calling reusable utility functions when users interact with the interface.

This separation makes the application easier to navigate and gives each file a clearer purpose.

---

## 10. Course Completion

This day concludes the fourth course of the diploma.

Throughout this course, we progressed from frontend fundamentals to building a practical Fullstack DApp that communicates with a deployed smart contract.

Our journey included:

- Learning React and Next.js fundamentals.
- Understanding components, routing, and navigation.
- Working with React state and hooks.
- Understanding DApp architecture.
- Preparing a Solidity smart contract using Foundry.
- Deploying the contract to the Sepolia testnet.
- Configuring Reown AppKit and Wagmi.
- Connecting a wallet using MetaMask.
- Switching between supported blockchain networks.
- Reading data from a smart contract.
- Writing transactions to a smart contract.
- Retrieving wallet connection information.
- Using the Spread Operator to reuse contract configuration.
- Refactoring the application into separate modules.
- Applying the Open/Closed Principle as a guide for making the code easier to extend.

### Final Outcome

We successfully built our first practical Fullstack DApp frontend connected to a deployed smart contract.

The application can connect a wallet, select a blockchain network, interact with a smart contract, and display account information.

We also took an important step toward writing more maintainable code by separating contract configuration and reusable interaction logic.

Completing this course is an important milestone, but it is also a foundation for building more advanced decentralized applications.

The next step is to continue expanding our knowledge and applying these concepts in larger, more complete Web3 projects.

---

## Resources

- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDN: Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript: keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [TypeScript: typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)