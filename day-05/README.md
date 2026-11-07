# Web3 Integration Setup with Reown AppKit and Wagmi

## Overview

This day focuses on preparing a Next.js frontend application for Web3 integration using **Reown AppKit**, **Wagmi**, **Viem**, and **TanStack Query**.

Before a frontend application can connect to a crypto wallet or interact with deployed smart contracts, it needs a properly configured Web3 environment. This includes installing the required packages, creating a Reown project, configuring supported blockchain networks, initializing the necessary providers, and preparing the Next.js application layout.

Throughout this day, we built that foundation step by step.

By the end of this setup, the frontend application is prepared for the next stage: connecting a wallet, reading data from smart contracts, and sending blockchain transactions.

## Learning Objectives

By completing this setup, you should understand how to:

- Install the packages required for Web3 frontend development.
- Create a project through the Reown Dashboard and obtain a Project ID.
- Configure Wagmi to work with Reown AppKit.
- Select and configure the blockchain networks supported by the application.
- Initialize the Wagmi adapter and its configuration.
- Understand the role of React Context and Context Providers.
- Set up Wagmi and TanStack Query providers.
- Configure cookie-based state hydration for server-side rendering.
- Integrate the Web3 provider into a Next.js root layout.
- Identify and resolve package version compatibility issues.

---

## 1. Installing the Required Packages

The first step is installing the dependencies needed to connect a Next.js application to blockchain networks and crypto wallets.

Navigate to the frontend project:

```bash
cd my-app
```

Install the required packages:

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi@2.x viem @tanstack/react-query
```

### Understanding the Installed Packages

Each package has a specific responsibility in the Web3 integration architecture.

| Package | Purpose |
|---|---|
| `@reown/appkit` | Provides the wallet connection interface and AppKit functionality. |
| `@reown/appkit-adapter-wagmi` | Connects Reown AppKit with Wagmi. |
| `wagmi` | Provides React hooks and utilities for interacting with Ethereum-compatible networks and smart contracts. |
| `viem` | Provides low-level TypeScript utilities for Ethereum interaction, including clients, accounts, ABI encoding, and contract operations. |
| `@tanstack/react-query` | Manages asynchronous server-state operations, caching, loading states, and query synchronization. |

### Understanding How These Tools Work Together

These libraries are not interchangeable. Each one handles a different part of the application.

- Reown AppKit provides the wallet connection experience.
- Wagmi manages the application's connection to blockchain functionality through React.
- Viem provides the underlying Ethereum interaction utilities used by the Wagmi ecosystem.
- TanStack Query manages asynchronous data and caching.
- The Reown Wagmi Adapter connects AppKit with the Wagmi configuration.

Together, they provide the foundation for building a frontend application that communicates with blockchain networks.

---

## 2. Creating a Reown Project

After installing the dependencies, the next step is creating a project through the Reown Dashboard.

### What Is Reown?

Reown provides tools for connecting applications to crypto wallets and blockchain ecosystems.

Its AppKit library allows developers to integrate wallet connection functionality into their applications without having to build the entire connection interface from scratch.

### Creating the Project

1. Open the [Reown Dashboard](https://dashboard.reown.com).
2. Sign in to your account.
3. Create a new project.
4. Configure the project as required.
5. Copy the generated Project ID.

The Project ID identifies the application when it communicates with Reown's services.

### Understanding the Project ID

The Project ID is required when initializing Reown AppKit and its Wagmi adapter.

We store it in an environment variable instead of writing it directly into the source code.

Create a `.env` file in the root of the `my-app` directory:

```env
NEXT_PUBLIC_PROJECT_ID=YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the actual ID obtained from the Reown Dashboard.

### Why Use an Environment Variable?

Environment variables make configuration easier to manage across development and deployment environments.

In Next.js, variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle.

This is intentional here because the frontend needs the Project ID to initialize AppKit.

**Important:** A Project ID is not equivalent to a private key. Never store wallet private keys, deployment private keys, or other secrets in `NEXT_PUBLIC_` variables.

Also, make sure `.env` is included in `.gitignore` so local configuration is not accidentally committed.

After changing environment variables, restart the Next.js development server so the application can load the updated values.

---

## 3. Wagmi Configuration

After installing the dependencies and obtaining the Project ID, we need to configure Wagmi.

Wagmi provides the configuration that defines how our frontend interacts with supported blockchain networks.

For this purpose, we use the `WagmiAdapter` provided by Reown.

### Creating the Configuration Directory

Inside `my-app`, create the following structure:

```text
my-app/
├── config/
│   └── index.tsx
├── app/
├── components/
├── context/
└── ...
```

The `config` directory contains the configuration required by the Web3 integration.

Create `config/index.tsx` and add the following code:

```tsx
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'

// Get the Project ID from the environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Define the supported blockchain networks
export const networks = [sepolia]

// Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

// Export the Wagmi configuration
export const config = wagmiAdapter.wagmiConfig
```

### Understanding the Configuration

Let's break down the important parts.

#### Importing the Required Utilities

```tsx
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
```

- `cookieStorage`: Provides cookie-based storage for Wagmi state.
- `createStorage`: Creates a storage configuration used by Wagmi.
- `WagmiAdapter`: Connects Reown AppKit with Wagmi.
- `sepolia`: Represents the Sepolia Ethereum test network.

#### Reading the Project ID

```tsx
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
```

This reads the Project ID from the environment configuration.

We also validate that it exists:

```tsx
if (!projectId) {
  throw new Error('Project ID is not defined')
}
```

This prevents the application from continuing with a missing Project ID and makes configuration errors easier to identify.

#### Configuring the Supported Networks

```tsx
export const networks = [sepolia]
```

This defines the blockchain networks supported by our application.

In the original documentation example, the configuration included:

```tsx
import { mainnet, arbitrum } from '@reown/appkit/networks'
```

For our project, we replaced those networks with Sepolia.

### Why Sepolia?

Sepolia is an Ethereum test network used for development and testing.

We already deployed our Counter smart contract to Sepolia in the previous stage of this journey. Therefore, configuring the frontend to use Sepolia prepares us to interact with that deployed contract.

The network configuration must remain consistent throughout the integration. We use Sepolia in the Wagmi adapter and in the AppKit initialization.

#### Initializing the Wagmi Adapter

```tsx
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})
```

This creates the adapter that connects AppKit with Wagmi.

Important configuration options:

- `storage`: Defines how Wagmi persists relevant connection state.
- `ssr: true`: Enables support for server-side rendering environments.
- `projectId`: Identifies our Reown project.
- `networks`: Defines the supported blockchain networks.

Finally, we export the Wagmi configuration:

```tsx
export const config = wagmiAdapter.wagmiConfig
```

This configuration will be used by the Wagmi provider later.

---

## 4. Understanding Context and Context Providers

Before integrating the Web3 providers into our application, it is important to understand React Context.

### What Is React Context?

React Context is a React feature that allows data to be shared between components without manually passing props through every level of the component tree.

Consider an application with several nested components.

Without Context, data may need to be passed from a parent component to a child, then to another child, and so on. This is commonly known as **prop drilling**.

Context provides another way to make shared data available to components that need it.

### What Is a Context Provider?

A Context Provider is a component that makes a particular context value available to its descendant components.

Conceptually, it works like this:

```text
Application
    |
    └── Provider
          |
          ├── Component A
          |
          ├── Component B
          |
          └── Component C
```

Components inside the provider can access the shared context through the relevant Context API.

### Why Do We Need Providers in a Web3 Application?

Our frontend needs access to several shared services:

- Wagmi configuration and blockchain connection state.
- TanStack Query functionality for managing asynchronous data.
- Reown AppKit initialization and wallet connection functionality.

Instead of configuring these services separately inside individual components, we initialize the required providers near the root of the application.

This makes the integration available throughout the component tree.

---

## 5. Creating the Web3 Context Provider

Now that we understand Context Providers, we can connect the libraries we installed and configured.

### Creating the Context Directory

Inside `my-app`, create:

```text
my-app/
├── config/
│   └── index.tsx
├── context/
│   └── index.tsx
├── app/
└── ...
```

Create `context/index.tsx` and add the following code:

```tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { sepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up QueryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up application metadata
const metadata = {
  name: 'Fullstack DApp Journey',
  description: 'A Fullstack DApp built with Next.js and Web3 technologies',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true
  }
})

function ContextProvider({
  children,
  cookies
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  )

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
```

### Understanding the Context Provider Code

#### The Client Directive

```tsx
'use client'
```

This directive marks the file as a Client Component in the Next.js App Router.

The provider initializes client-side functionality and uses libraries that depend on browser-side React behavior.

Placing the directive at the top of the file makes the client boundary explicit.

#### Importing the Configuration

```tsx
import { wagmiAdapter, projectId } from '@/config'
```

Instead of repeating the Wagmi configuration, we import the adapter and Project ID from the configuration module created earlier.

The `@/` prefix is a path alias configured by the Next.js project. It allows us to reference files using paths relative to the configured project root.

#### Creating the Query Client

```tsx
const queryClient = new QueryClient()
```

TanStack Query uses a Query Client to manage asynchronous queries and their cached results.

The client provides functionality such as:

- Caching data.
- Managing loading and error states.
- Reusing previously fetched data.
- Controlling query behavior.

We create one Query Client and provide it to the application through `QueryClientProvider`.

#### Application Metadata

```tsx
const metadata = {
  name: 'Fullstack DApp Journey',
  description: 'A Fullstack DApp built with Next.js and Web3 technologies',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
```

Metadata describes the application to Reown AppKit.

It includes:

- `name`: The application's name.
- `description`: A short description of the application.
- `url`: The application's origin.
- `icons`: Application icon URLs.

The URL should match the actual application origin and domain used by the project.

For local development, `http://localhost:3000` can be used when that is the application's development origin. When deploying the application, update it to the production origin.

#### Initializing Reown AppKit

```tsx
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true
  }
})
```

This is where we initialize Reown AppKit.

Let's understand the options:

| Option | Purpose |
|---|---|
| `adapters` | Specifies the adapters that connect AppKit to other libraries. |
| `projectId` | Identifies the Reown project. |
| `networks` | Defines the networks available in the application. |
| `defaultNetwork` | Sets the network selected by default. |
| `metadata` | Provides information about the application. |
| `features` | Controls optional AppKit features. |

We use the Wagmi adapter because our application relies on Wagmi for blockchain integration.

We also configure Sepolia as both the supported network and the default network.

The `createAppKit` call initializes the AppKit modal. The resulting `modal` variable can be used when an application needs to access the returned modal instance directly.

#### The ContextProvider Component

```tsx
function ContextProvider({
  children,
  cookies
}: {
  children: ReactNode
  cookies: string | null
}) {
```

The provider receives two properties:

- `children`: The components that should be rendered inside the provider.
- `cookies`: The cookies received from the incoming request.

`ReactNode` is a React type representing content that can be rendered by React.

#### Restoring the Initial Wagmi State

```tsx
const initialState = cookieToInitialState(
  wagmiAdapter.wagmiConfig as Config,
  cookies
)
```

This function uses the incoming cookies to derive the initial Wagmi state.

The purpose is to help preserve and restore relevant connection state during server rendering and hydration.

The `as Config` expression is a TypeScript type assertion. It tells TypeScript to treat the adapter configuration as a Wagmi `Config` value.

#### WagmiProvider

```tsx
<WagmiProvider
  config={wagmiAdapter.wagmiConfig as Config}
  initialState={initialState}
>
```

`WagmiProvider` makes the Wagmi configuration available to the React components rendered inside it.

This allows those components to use Wagmi hooks and access the configured blockchain environment.

#### QueryClientProvider

```tsx
<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

`QueryClientProvider` makes the TanStack Query client available to the component tree.

The `children` are rendered inside both providers.

The resulting structure is:

```text
ContextProvider
    |
    └── WagmiProvider
          |
          └── QueryClientProvider
                |
                └── Application Components
```

This means the application components are rendered inside both the Wagmi and TanStack Query provider environments.

---

## 6. Integrating the Provider into the Next.js Layout

Creating the provider is not enough. We also need to make it part of the application's component tree.

Next.js App Router provides a root layout file automatically when creating a project.

The file is located at:

```text
my-app/
└── app/
    └── layout.tsx
```

We update this existing file to include our Context Provider.

### Updated Root Layout

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { headers } from 'next/headers'
import ContextProvider from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fullstack DApp Journey',
  description: 'A Next.js application powered by Reown AppKit and Wagmi'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
```

### Understanding the Layout Changes

#### Importing the Context Provider

```tsx
import ContextProvider from '@/context'
```

We import the provider created earlier.

Because the module contains an `index.tsx` file, the directory import resolves to that file.

#### Importing Next.js Headers

```tsx
import { headers } from 'next/headers'
```

Next.js provides the `headers()` function to access incoming request headers.

In this setup, we use it to retrieve the cookies associated with the request.

#### Reading the Cookies

```tsx
const headersObj = await headers()
const cookies = headersObj.get('cookie')
```

The `headers()` function is asynchronous in the Next.js version used by this project, so we await its result.

Then we read the `cookie` header and pass its value to the Context Provider.

This allows the provider to derive the initial Wagmi state using the cookie information.

#### Wrapping the Application

```tsx
<ContextProvider cookies={cookies}>
  {children}
</ContextProvider>
```

This is the most important integration point in the layout.

By wrapping `children` with `ContextProvider`, the provider becomes part of the root component tree.

As a result, pages and components rendered inside the layout can access the Wagmi and TanStack Query provider environments.

### Why Does the Root Layout Remain a Server Component?

The root layout does not need to become a Client Component just because it renders a client-side provider.

Next.js supports composing Server Components and Client Components.

In our setup:

- `layout.tsx` remains an asynchronous Server Component.
- `ContextProvider` is a Client Component.
- The application content is rendered inside the provider.

This allows us to use server-side request information in the layout while keeping the Web3 provider functionality on the client side.

---

## 7. Fixing Package Version Mismatches

The final lesson focused on package version compatibility.

When working with a collection of related Web3 libraries, incompatible versions can cause installation errors, TypeScript errors, or unexpected runtime behavior.

For example, our project uses:

- Reown AppKit.
- Reown's Wagmi Adapter.
- Wagmi.
- Viem.
- TanStack Query.

These packages have their own version requirements and peer dependencies.

### What Is a Version Mismatch?

A version mismatch happens when installed packages do not satisfy the compatibility requirements expected by another package.

For example, an adapter may require a particular major version of Wagmi, while the project has a different major version installed.

Even if the package installation succeeds, incompatible versions can lead to problems when compiling or running the application.

### Checking Installed Versions

You can inspect the installed dependency tree using:

```bash
npm ls @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

This helps identify the versions currently installed and whether npm reports dependency problems.

### Checking Package Requirements

Before changing versions, check the relevant package documentation and peer dependency requirements.

Do not randomly upgrade or downgrade packages. The goal is to use a compatible set of versions.

After correcting the dependency versions, install the dependencies again and verify the project:

```bash
npm install
npm ls
```

If the dependency tree is consistent, run the development server and check that the application compiles:

```bash
npm run dev
```

### Important Note

The exact compatible versions can change as Reown, Wagmi, Viem, and TanStack Query evolve.

Always check the current documentation and the peer dependency requirements of the versions you are installing instead of blindly copying version numbers from an older tutorial.

---

## 8. Final Project Structure

After completing this setup, the relevant frontend structure looks like this:

```text
fullstack-dapp-journey/
├── day-01/
├── day-02/
├── day-03/
├── day-04/
├── day-05/
│   └── README.md
│
├── my-app/
│   ├── app/
│   │   ├── about/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── counter.tsx
│   │
│   ├── config/
│   │   └── index.tsx
│   │
│   ├── context/
│   │   └── index.tsx
│   │
│   ├── public/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── ...
│
└── my-foundry/
    ├── src/
    ├── test/
    ├── script/
    └── ...
```

The `.env` file is shown to explain the local project structure. It must remain excluded from Git.

---

## 9. Understanding the Complete Integration Architecture

At this stage, it is useful to look at how all the pieces fit together.

```text
                 Reown Dashboard
                       |
                       | Project ID
                       |
                       v
                 Environment File
                       |
                       v
                Wagmi Configuration
                       |
                       v
                  Wagmi Adapter
                       |
                       v
                Reown AppKit Setup
                       |
                       v
                 Context Provider
                       |
             +---------+----------+
             |                    |
             v                    v
        WagmiProvider     QueryClientProvider
             |                    |
             +---------+----------+
                       |
                       v
                 Next.js Layout
                       |
                       v
                Application Pages
                       |
                       v
              Future Web3 Integration
                       |
             +---------+----------+
             |                    |
             v                    v
        Wallet Connection   Smart Contract
                               Interaction
```

### What We Have Achieved

We have completed the initial Web3 configuration of our frontend application.

The project now has:

1. The required Web3 dependencies installed.
2. A Reown project and its Project ID configured.
3. A Wagmi adapter connected to the Reown configuration.
4. Sepolia configured as the supported and default network.
5. A Context Provider initialized with Wagmi and TanStack Query.
6. Cookie-based initial state handling.
7. The provider integrated into the Next.js root layout.
8. A dependency setup that can be checked for version compatibility.

### What Is Not Completed Yet?

This setup prepares the application for Web3 integration, but it does not by itself complete the wallet connection or smart contract interaction.

The next stage will focus on using the configured environment to:

- Display the wallet connection interface.
- Connect a crypto wallet.
- Access the connected account.
- Read data from a deployed smart contract.
- Send transactions to interact with smart contract functions.
- Connect the frontend to the Counter contract deployed on Sepolia.

---

## 10. Key Takeaways

This day established the foundation for connecting a Next.js application to the Web3 ecosystem.

The most important lesson is that frontend blockchain integration requires more than simply installing a wallet library.

We need a properly configured environment in which wallet connection, network configuration, blockchain interaction, asynchronous data management, and React application state work together.

The responsibilities of the main tools can be summarized as follows:

- **Reown AppKit:** Wallet connection interface and application initialization.
- **Wagmi:** React-based blockchain interaction and connection management.
- **Viem:** Ethereum interaction utilities.
- **TanStack Query:** Asynchronous data management and caching.
- **Context Providers:** Make the required configurations available throughout the application.
- **Next.js Layout:** Provides the root structure in which the application and its providers are composed.

With this foundation in place, the next step is to move from configuration to actual interaction with wallets and smart contracts.

---

## Resources

- [Reown Documentation](https://docs.reown.com/)
- [Reown Dashboard](https://dashboard.reown.com/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethereum Sepolia Testnet](https://sepolia.etherscan.io/)

---

he frontend Web3 environment is configured and ready for the next stage of wallet and smart contract integration.