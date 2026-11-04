# React Fundamentals & Next.js Basics

## Overview

This day marks the beginning of the practical side of Fullstack DApp Development. The focus is on understanding the fundamentals of Next.js, learning how its application structure works, and building the first pages and reusable components.

The goal is to understand how a Next.js application is organized, how users navigate between pages, and how components help build maintainable user interfaces.

All practical examples in this guide are implemented in the `my-app` project.

## 1. Pages and Components

Pages and components are two fundamental building blocks of a Next.js application.

### Pages

A page represents a route that users can access through the browser.

In the Next.js App Router, a page is created by adding a `page.tsx` file inside the `app` directory or one of its route folders.

For example:

```text
app/
├── page.tsx
└── about/
    └── page.tsx
```

This structure creates two routes:

| File | Route |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |

Each `page.tsx` file exports a React component that Next.js uses to render the corresponding page.

### Components

A component is a reusable piece of UI that can be rendered inside a page or another component.

Components help divide an interface into smaller, independent parts, making applications easier to organize, maintain, and extend.

For example, a navigation bar, button, counter, or wallet connection panel can each be implemented as a separate component.

Unlike route pages, reusable components do not automatically create browser routes.

## 2. Setting Up a Next.js Project

Before creating a Next.js application, Node.js must be installed.

Node.js provides the JavaScript runtime required by the development tools, while npm is the package manager used to install dependencies and run project scripts.

### Creating the Project

A Next.js project can be initialized from the terminal using the official project creation tool:

```bash
npx create-next-app@latest my-app
```

This creates a new project named `my-app` and guides the developer through the initial configuration.

After creating the project, move into its directory:

```bash
cd my-app
```

### Understanding the Default Project Structure

A newly created Next.js project contains several files and directories. The exact structure may vary depending on the options selected during setup.

The main elements include:

| File or Directory | Purpose |
|---|---|
| `app/` | Contains application routes, layouts, and related files. |
| `public/` | Stores static assets that can be referenced by the application. |
| `node_modules/` | Contains installed project dependencies. |
| `.next/` | Stores generated build and development output. |
| `package.json` | Defines project metadata, scripts, and dependencies. |
| `package-lock.json` | Records the resolved dependency versions. |
| `tsconfig.json` | Configures TypeScript behavior. |
| `next.config.ts` | Contains Next.js configuration. |
| `next-env.d.ts` | Provides Next.js TypeScript declarations. |
| `eslint.config.mjs` | Configures ESLint rules. |
| `.gitignore` | Specifies files and directories Git should ignore. |
| `README.md` | Documents the project. |

Some important files inside the `app/` directory:

| File | Purpose |
|---|---|
| `page.tsx` | Defines the application's home page. |
| `layout.tsx` | Defines the shared layout surrounding pages. |
| `globals.css` | Contains global CSS styles. |
| `favicon.ico` | Defines the browser tab icon. |

Understanding this structure makes it easier to navigate a Next.js project and know where each part of the application belongs.

## 3. Running the Application Locally

After creating the project, the development server can be started with:

```bash
npm run dev
```

This command runs the `dev` script defined in `package.json` and starts the Next.js development server.

The application becomes accessible through a local address, commonly:

```text
http://localhost:3000
```

### What Is Localhost?

`localhost` is a hostname that refers to the local machine.

When the development server is running, the browser can send requests to it and receive responses containing the resources needed to display the application.

The application can also be accessed through the machine's local network IP address when the development server is configured to accept network connections.

### Understanding the Request and Response Cycle

A simplified web request cycle works as follows:

1. A user opens a URL in the browser.
2. The browser sends an HTTP request to the server.
3. The server processes the request.
4. The server sends an HTTP response.
5. The browser uses the returned response to display the page.

In local development, the Next.js development server handles these requests and provides the application to the browser.

This is an important foundation for understanding how frontend applications communicate with servers and, eventually, blockchain infrastructure.

## 4. File-System Routing in Next.js

Next.js App Router uses a file-system-based routing approach.

This means that routes are created through the folder structure inside the `app/` directory.

Instead of manually configuring every route, developers create the appropriate folders and place a `page.tsx` file inside each route folder.

### Creating an About Page

Inside the `app/` directory, create a folder named `about`:

```text
app/
└── about/
```

Then create a `page.tsx` file inside it:

```text
app/
└── about/
    └── page.tsx
```

Add the following component:

```tsx
export default function About() {
  return <>About us</>;
}
```

The `default` export provides the page component that Next.js renders for this route.

Now the page can be accessed at:

```text
http://localhost:3000/about
```

This demonstrates how the directory structure determines the URL path.

### Important Routing Concept

A folder does not become a page simply because it exists.

For a route to render a page in the App Router, it needs a `page.tsx` file in the corresponding route segment.

## 5. Navigation Between Pages Using Link

After creating multiple pages, users need a way to navigate between them.

Next.js provides the `Link` component for client-side navigation between application routes.

It can be imported from:

```tsx
import Link from "next/link";
```

### Example: Navigating to the About Page

Inside the home page:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>Hello DApp</div>

      <Link href="/about">
        <button style={{ cursor: "pointer" }}>
          About us
        </button>
      </Link>
    </>
  );
}
```

The `href` property specifies the destination route.

When the user clicks the link, Next.js navigates to `/about`.

### Why Use Next.js Link?

The `Link` component provides Next.js navigation behavior and supports client-side transitions between routes.

This is generally preferable to using a regular anchor element for internal navigation in a Next.js application.

## 6. Creating and Rendering Reusable Components

As an application grows, placing all interface code inside one page becomes difficult to maintain.

Reusable components solve this problem by allowing developers to separate interface elements into independent files.

### Creating a Components Directory

Inside the project root, create a directory named `components`:

```text
my-app/
└── components/
```

Then create a file named `counter.tsx`:

```text
my-app/
└── components/
    └── counter.tsx
```

### Creating the Counter Component

Add the following code:

```tsx
const Counter = () => {
  return (
    <div>
      Hello from counter components
    </div>
  );
};

export default Counter;
```

This defines a React functional component named `Counter`.

The component currently returns a simple `<div>` element. It is only a basic example demonstrating how a component can be created and exported.

### Exporting and Importing Components

The component is exported using:

```tsx
export default Counter;
```

It can then be imported into another file:

```tsx
import Counter from "@/components/counter";
```

The `@/` path alias is configured by the project's TypeScript setup and allows imports to reference paths from the configured project root.

### Rendering the Component

Inside `app/page.tsx`:

```tsx
import Link from "next/link";
import Counter from "@/components/counter";

export default function Home() {
  return (
    <>
      <div>Hello DApp</div>

      <Link href="/about">
        <button style={{ cursor: "pointer" }}>
          About us
        </button>
      </Link>

      <Counter />
    </>
  );
}
```

The `<Counter />` element renders the component inside the home page.

This demonstrates the basic component workflow:

1. Create a component.
2. Export it from its file.
3. Import it wherever it is needed.
4. Render it using JSX.

Components can be reused in multiple pages and other components, helping keep the application organized as it grows.

## 7. Current Project Structure

After completing the practical exercises, the project has the following structure:

```text
fullstack-dapp-journey/
│
├── day-01/
│   └── README.md
│
├── my-app/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── counter.tsx
│   │
│   ├── public/
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

The `my-app` directory will be the main development workspace for the upcoming practical work.

It will evolve gradually as new React and Next.js concepts are introduced and connected to the broader goal of building complete decentralized applications.

## 8. Key Takeaways

By completing these tutorials, the following concepts were introduced:

- Understanding the difference between pages and reusable components.
- Installing Node.js and creating a Next.js application.
- Exploring the default Next.js project structure.
- Running a development server using `npm run dev`.
- Understanding the basic HTTP request and response cycle.
- Learning how `localhost` is used during local development.
- Creating routes using the Next.js App Router.
- Navigating between internal pages using the `Link` component.
- Creating, exporting, importing, and rendering reusable React components.
- Organizing components in a dedicated `components` directory.

## 9. What's Next?

These fundamentals provide the starting point for building more interactive applications.

The next learning steps will focus on additional React concepts, including state, hooks, event handling, and component behavior.

These concepts will become especially important when building DApp interfaces that need to respond to user actions, connect wallets, read blockchain data, and interact with smart contracts.

---

*This guide documents the React and Next.js fundamentals covered in Day 02, with practical examples from the `my-app` project.*