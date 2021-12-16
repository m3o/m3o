# @m3o/auth

This package provides quick and easy authentication for Next.js by leveraging the [M3O User API](https://m3o.com/user). It provides both server routing and user state management for the UI.

## Installation

Firstly we need to install the package:

`npm install @m3o/auth`

or

`yarn add @m3o/auth`

## Getting Started

The M3O User service requires you to pass an API key which can be created via the [M3O.com](https://m3o.com) website. Once logged in / signed up, head to the [keys](https://m3o.com/account/keys) page and create your API key.

Once created, you will need to provide this key as an environment variable. You can do this by creating a `.env.local` file within your project and adding the key:

`M3O_KEY=xxxxx`

### API routes / handlers

This authentication package works by first setting up your server via the `pages/api` folder, then connecting to the server via provided hooks and providers (optional).

#### Server installation

Firstly, create the a file called `[...m3oUser].(js|ts)` under this folder `pages/api/user/`.

Once this is setup, you now need to import the `handleAuth` function which will setup all your API routing for user authentication.

```javascript
import { handleAuth } from '@m3o/nextjs'

export default handleAuth()
```

This will setup these routes for your UI to call:

- `POST: api/user/login`
- `POST: api/user/logout`
- `POST: api/user/sign-up`
- `GET: api/user/me`
- `POST: api/user/reset-password`

These routes will now handle all your session authentication against the M3O User service.

#### Client installation

On the client we provide useful hooks and providers to integrate with your newly setup API. This will help you with authentication state management.

Within your `_app.(tsx|jsx)` we will need to import our `<AuthProvider />` component. This will handle our authentication state:

```javascript
import { AuthProvider } from '@m3o/auth'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const { user } = pageProps

  return (
    <AuthProvider user={user}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
```

By providing the user to `<AuthProvider />`, we're able to share the user across the application without the need to add this to each layout.

#### Authentication state:

The `AuthProvider` uses [React Context](https://reactjs.org/docs/context.html) to pass down the user authentication state to your app:

- `isAuthenticating: boolean` - Returns whether the user is authenticating against the server. This is usually only run on first render and will return `false` when the user has authenticated against the server (whether they're logged in or not).
- `user: Account?` - Returns `user` account from the [M3O user service](https://m3o.com/user). Will remain `undefined` when the user is not logged in.
- `setUser: (user?: Account) => void` - You will rarely use this method. If you're using our provided hooks then this will generally be used internally. A general use case for this method would be when you want to create your own logout logic.

### Client Hooks

### useEmailLogin

#### Introduction

The hook provides functionality to allow your user to login to your application via email/password.

```typescript
import { useEmailLogin } from '@m3o/auth'

interface FormFields {
  email: string
  password: string
}

export function App() {
  const { login } = useEmailLogin()

  function onFormSubmit(fields: FormFields) {
    login(fields)
  }
}
```

#### Usage

When the hook is called

```typescript
const result = useEmailLogin()
```

The result object contains these properties:

- `isLoading: boolean` - This will return `true` when `login` has been called and is logging in against the user service. When the call is complete (either on error or success), this will return `false`.
- `isError: boolean` - This will return `true` when there has been an error when logging in. Usually when incorrect data is sent or returned from your server.
- `isIdle: boolean` - This will return `true` when no interaction is happening within your hook.
- `login: (field: { email: string; password: string }) => Promise<void>` - This is the function that will be needed to call to login the user to the user service.

This hook also can receive two methods:

##### onSuccess

This method is called once the user has been logged in. Please note that on login the `user` will now be available via the `AuthProvider`.

```typescript
const result = useEmailLogin({
  onSuccess: () => {
    // Called on successful login
  }
})
```

The `onSuccess` method is great for times where you need to redirect after the user has logged in:

```typescript
import { useRouter } from 'next/router'
import { useEmailLogin } from '@m3o/auth'

export function App() {
  const router = useRouter()
  const result = useEmailLogin({
    onSuccess: () => {
      router.push('/')
    }
  })

  return //...
}
```

##### onError

This method is called when the user attempts to login but there is an error received from the server.

```typescript
const result = useEmailLogin({
  onError: () => {
    // Oops an error has occurred. :(
  }
})
```

### useAuthNextSSG

If you're not looking to SSR your Next.js application then we recommend using this hook to authenticate your `user`.

This hook receives the authentication state provided above and will redirect when the user is not logged in. If you do not require this redirection, please use the `useAuthContext` hook.

```typescript
import type { NextPage } from 'next'
import { useAuthNextSSG } from '@m3o/auth'

const PrivateClient: NextPage = () => {
  const { user, isAuthenticating } = useAuthNextSSG({ redirectTo: '/' })

  if (isAuthenticating) {
    return <p>Loading...</p>
  }

  return <div>{user.email}</div>
}

export default PrivateClient
```
