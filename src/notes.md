- [Notes](#notes)
  - [General](#general)
  - [Source tree](#source-tree)
  - [Routes](#routes)
  - [Context Provider](#context-provider)
    - [Example:](#example)
  - [Component naming / splitting](#component-naming--splitting)
    - [Layout example](#layout-example)
  - [Styling](#styling)

# Notes

## General

- Avoid `npx create-react-app`.
- Use `npm create vite` for project setup: fast, easy to use, configurable, extensible.
- Use `.jsx` extension for React components.
- Use a linter (eslint) to enforce code style.
- Use a formatter (prettier) to enforce code style.
- Doesn't matter how you configure it, as long as it's consistent.
- Do a build regularly to catch errors early.
- Make sure data exists and has the expected type before using it.
- TypeScript comes in handy here.
- Organise source code as below.

## Source tree

```bash
├── src
│   ├── assets                  # Static assets ⚠
│   │   ├── images
│   │   │   ├── image.png
│   │   ├── metadata
│   │   │   ├── file.json
│   ├── reducers
│   │   ├── NameReducer.js      # Custom reducers ⚠
│   ├── hooks
│   │   ├── useHookName.js      # Custom hooks -
│   ├── contexts                # Contexts ⚠
│   │   ├── ContextName.jsx
│   ├── components              # Components ✓
│   │   ├── ComponentName.jsx
│   │   ├── ComponentName.css
│   ├── pages                   # Pages served by the router ⚠
│   │   ├── PageName.jsx
│   │   ├── PageName.css
│   ├── utils                   # Utility functions ⚠
│   │   ├── util.js
│   ├── App.jsx                 # Main app component containing router ✓
│   ├── App.css
│   ├── index.jsx               # Entry point ✓
│   ├── index.css

# ✓ = Doing well
# ⚠ = Doing not so well
```

## Routes

| Page  | Path     |
| ----- | -------- |
| Home  | `/`      |
| Login | `/login` |
| 404   | `*`      |

## Context Provider

Redirect from within context to `/login` page if user is not logged in.

### Example:

```jsx
// ContextName.jsx
import React, { createContext, useContext, useState } from "react";
import { Redirect } from "react-router-dom";

const SomeContext = createContext();
export const useSomeContext = () => useContext(SomeContext);

const SomeContextProvider = ({ children }) => {
  const [value, setValue] = useState(false);

  const someValue = { value };

  return (
    <SomeContext.Provider value={someValue}>
      {value ? children : <Redirect to="/login" />}
    </SomeContext.Provider>
  );
};
```

## Component naming / splitting

1. Prevent loose static html elements in pages, create components instead.
2. Use proper nesting/mapping.
   - Home > Posts > Post
   - Home contains one Posts component, which contains more Post components.
3. Optional for now: Create layout components for page layout, example below.

### Layout example

```jsx
// Layout.jsx
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Home.jsx
const HomePage = () => {
  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
};
```

## Styling

Really interested in some cool styling, take a dive in sass/scss. It's a great way to keep your css clean and organized. It's also a great way to keep your css DRY.
