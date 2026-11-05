#  State Management & React Hooks

## Overview

This day focuses on one of the most important concepts in React: managing component state and responding to user interactions.

So far, the application has mainly displayed static content. In this stage, the focus shifts toward building interactive components that can store information, respond to events, and update their user interface dynamically.

The practical implementation is based on a Counter Component built inside the `my-app` Next.js project.

Throughout this guide, we will explore React component types, understand what Hooks are, experiment with `useEffect`, handle click events with `onClick`, and finally use `useState` to build a fully interactive counter.

## 1. Understanding State Management

### What Is State?

State is data that a component manages and that can change over time.

For example, consider a counter component displaying:

```text
Counter: 2
```

When the user clicks the increment button, the counter should become:

```text
Counter: 3
```

The displayed value changes based on user interaction. React needs a way to keep track of this changing information and update the interface when its value changes.

This is the purpose of component state.

### What Is State Management?

State management refers to how an application stores, updates, and uses changing data.

In React, state helps components maintain information and reflect changes in the user interface.

Examples of state in a typical application include:

- A counter value.
- Whether a menu is open or closed.
- Form input values.
- Whether a user is authenticated.
- Whether a wallet is connected.

State management becomes especially important when building interactive applications such as decentralized applications.

## 2. Class Components and Functional Components

React has two component approaches that are important to understand: Class Components and Functional Components.

### Class Components

Class Components are components defined using JavaScript classes.

They can manage state and use lifecycle methods to control behavior during different stages of a component's lifecycle.

### Functional Components

Functional Components are JavaScript functions that return React elements.

They provide a simpler way to define components and can use React Hooks to manage state and perform additional component-related operations.

Example:

```tsx
const Counter = () => {
  return (
    <div>
      Hello from counter component
    </div>
  );
};

export default Counter;
```

This is the functional component structure used throughout our practical examples.

### Understanding the Difference

| Class Components | Functional Components |
|---|---|
| Defined using JavaScript classes. | Defined using JavaScript functions. |
| Use `this` to access component members. | Do not use `this` for component state. |
| Use lifecycle methods. | Use Hooks for state and effects. |
| Have a class-based structure. | Have a function-based structure. |

The practical work in this project uses Functional Components and React Hooks.

## 3. Understanding React Hooks

### What Are Hooks?

Hooks are special React functions that allow Functional Components to use React features such as state management and side effects.

They make it possible to add component behavior without converting a Functional Component into a Class Component.

Some commonly used Hooks include:

| Hook | Purpose |
|---|---|
| `useState` | Stores and updates component state. |
| `useEffect` | Performs side effects after rendering. |

Hooks are called inside React Function Components or custom Hooks, following React's Rules of Hooks.

They should not be called inside loops, conditions, or nested functions.

### Why Do We Need Hooks?

A regular JavaScript variable can store a value, but changing that variable does not tell React to render the component again.

Hooks provide a way to connect changing data and component behavior to React's rendering process.

In this day, we focus on two important Hooks: `useEffect` and `useState`.

## 4. Exploring useEffect

The `useEffect` Hook allows a component to perform side effects after React has rendered it.

Side effects are operations that interact with something outside the component's rendering process.

Examples include:

- Logging information to the console.
- Fetching data from an API.
- Setting up subscriptions.
- Managing timers.
- Synchronizing with external systems.

### First useEffect Experiment

The first practical example introduces `useEffect` inside the Counter Component.

```tsx
"use client";

import React, { useEffect } from "react";

const Counter = () => {
  useEffect(() => {
    console.log("component just started");
  });

  return (
    <div>
      Hello from counter components
    </div>
  );
};

export default Counter;
```

### Understanding the Code

**1. The Client Directive**

```tsx
"use client";
```

This directive marks the component as a Client Component in the Next.js App Router.

It is necessary when a component needs client-side interactive features such as React state and event handlers.

**2. Importing useEffect**

```tsx
import React, { useEffect } from "react";
```

This imports the `useEffect` Hook so it can be used inside the component.

**3. Calling useEffect**

```tsx
useEffect(() => {
  console.log("component just started");
});
```

The function passed to `useEffect` runs after the component renders.

An important detail: this example does not provide a dependency array.

Therefore, the Effect runs after every render, not only when the component first starts.

### Understanding the Dependency Array

The dependency array controls when an Effect runs.

| Syntax | Behavior |
|---|---|
| `useEffect(() => {})` | Runs after every render. |
| `useEffect(() => {}, [])` | Runs after the initial mount. |
| `useEffect(() => {}, [value])` | Runs after the initial mount and when `value` changes. |

These examples describe the dependency behavior. The practical tutorial introduced the first form without a dependency array.

Understanding this difference is important when working with Effects in real applications.

## 5. Building the Counter Component

After understanding the basic component structure and experimenting with `useEffect`, the next step is building the Counter interface.

The initial version contains a displayed value and three buttons:

- Decrement (`-`)
- Reset
- Increment (`+`)

### Initial Counter Implementation

```tsx
"use client";

const Counter = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Counter : 10</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }}
      >
        <button>-</button>
        <button>Reset</button>
        <button>+</button>
      </div>
    </div>
  );
};

export default Counter;
```

### Why Are the Buttons Not Working?

At this stage, the buttons are only visual elements.

They have no event handlers and are not connected to any state.

The displayed number is also hardcoded:

```tsx
<h1>Counter : 10</h1>
```

This means that clicking the buttons cannot change the displayed value.

To make the buttons interactive, we first need to understand how React handles user events.

## 6. Handling Events with onClick

React provides event handlers that allow components to respond to user interactions.

One of the most commonly used event handlers is `onClick`.

It executes a function when the user clicks an element.

### Adding Event Handler Functions

The next implementation introduces three functions:

- `decrement`
- `reset`
- `increment`

```tsx
"use client";

const Counter = () => {
  const decrement = () => {
    console.log("decrement");
  };

  const reset = () => {
    console.log("reset");
  };

  const increment = () => {
    console.log("increment");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Counter : 10</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }}
      >
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

export default Counter;
```

### Understanding onClick

Each button is connected to a function through its `onClick` property.

For example:

```tsx
<button onClick={increment}>+</button>
```

When the user clicks the button, React invokes the `increment` function.

At this stage, the functions only print messages to the browser console.

This confirms that the click events are working, but the counter value still does not change.

### Important: Passing a Function vs. Calling a Function

The correct approach is:

```tsx
<button onClick={increment}>+</button>
```

This passes the function to React so it can execute it when the click happens.

It is different from:

```tsx
<button onClick={increment()}>+</button>
```

The second example calls the function during rendering rather than waiting for the click.

## 7. Managing State with useState

Now that the component can detect user interactions, the next step is making those interactions change the displayed value.

This is where the `useState` Hook comes in.

### Introducing useState

`useState` is a React Hook that allows a Functional Component to store and update state.

Its basic syntax is:

```tsx
const [state, setState] = useState(initialValue);
```

It returns an array containing two values:

1. The current state value.
2. A function used to update that state.

### Understanding the Counter State

In our Counter Component:

```tsx
const [count, setCount] = useState(0);
```

Here is what each part means:

| Part | Meaning |
|---|---|
| `count` | The current counter value. |
| `setCount` | The function used to update the counter. |
| `useState(0)` | Initializes the counter with a value of `0`. |

The initial value is used when the component is first mounted.

Whenever the state is updated using `setCount`, React schedules another render so the interface can display the updated value.

### Updating State Using the Previous Value

The counter needs to increase or decrease based on its current value.

React allows state updates using an updater function:

```tsx
setCount(prev => prev + 1);
```

The updater function receives the previous state value and returns the next value.

For incrementing:

```tsx
const increment = () => setCount(prev => prev + 1);
```

For decrementing:

```tsx
const decrement = () => setCount(prev => prev - 1);
```

Using the previous state is useful when the next value depends on the current value.

### Resetting the Counter

The Reset button should return the counter to its initial value.

```tsx
const reset = () => {
  setCount(0);
};
```

This directly updates the state to `0`.

## 8. Final Counter Implementation

After connecting the buttons to state updates, the Counter Component becomes fully interactive.

```tsx
"use client";

import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  const decrement = () => setCount(prev => prev - 1);
  const increment = () => setCount(prev => prev + 1);

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Counter : {count}</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }}
      >
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

export default Counter;
```

### Understanding the Final Result

The component now follows a complete interaction cycle:

1. React initializes `count` with `0`.
2. The current value is displayed using `{count}`.
3. The user clicks one of the buttons.
4. The corresponding event handler executes.
5. The handler updates the state using `setCount`.
6. React renders the component again with the updated value.
7. The interface displays the new counter value.

### Example Interaction

| User Action | Previous Value | New Value |
|---|---:|---:|
| Initial render | — | 0 |
| Increment | 0 | 1 |
| Increment | 1 | 2 |
| Decrement | 2 | 1 |
| Reset | 1 | 0 |

The counter is no longer displaying a fixed number. It now reflects the current state of the component.

## 9. How State Updates Connect to Rendering

One of the most important ideas from this lesson is the relationship between state and rendering.

The following simplified flow illustrates what happens when a user interacts with the Counter:

```text
User clicks a button
        |
        v
   onClick event
        |
        v
 Event handler runs
        |
        v
   setCount(...)
        |
        v
 React schedules a render
        |
        v
 Component renders again
        |
        v
 Updated count appears
```

This is the basic mechanism that makes interactive React interfaces possible.

The same principle will be used when building interfaces that respond to wallet connections, transaction updates, and blockchain data.

## 10. Key Takeaways

By completing this day, the following concepts were introduced and practiced:

- Understanding state management and why components need state.
- Learning the difference between Class Components and Functional Components.
- Understanding React Hooks and their purpose.
- Exploring `useEffect` and its execution behavior.
- Understanding the importance of the dependency array.
- Building a Counter Component with a static interface.
- Handling user interactions using `onClick`.
- Connecting event handlers to JavaScript functions.
- Managing component state using `useState`.
- Updating state using the previous value.
- Understanding how state updates trigger component rendering.
- Building a fully interactive Counter Component.

## 11. What's Next?

Understanding state and component interactions is an important step toward building more advanced React applications.

These concepts will become useful when implementing features such as:

- Wallet connection and disconnection.
- Displaying connected wallet information.
- Tracking transaction states.
- Updating balances after blockchain interactions.
- Handling user input and application data.

The Counter Component is a small exercise, but the underlying concepts are essential building blocks for larger applications.

---

*This guide documents the State Management and React Hooks concepts covered in Day 03, with practical examples implemented in the `my-app` Next.js project.*