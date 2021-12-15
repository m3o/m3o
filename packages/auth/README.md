# M3O User API

This project provides quick and easy authentication for Next.js by leveraging the [M3O User API](https://m3o.com/user). The package provides the server routing and user state management for the UI.

## Getting Started

Please firsty make sure that you have created an API Key on [M3O.com](https://m3o.com). Once you have created this key please create a `.env.local` file within your project and add the key:

`M3O_KEY=xxxxx`

### API routes / handlers

Firstly you need to create the a file that will create all your user route handling. Within the `pages/api` folder create a file under the user folder called `[...m3oUser].(ts|js)`. e.g `pages/api/user/[...m3oUser].js`.

Once this file is setup we now need to call the function that will create the all the authentication handling on your API:

```javascript
import { handleAuth } from '@m3o/nextjs'

export default handleAuth()
```

This will setup these handlers:

- `POST: api/user/login`
- `POST: api/user/logout`
- `POST: api/user/sign-up`
- `GET: api/user/me`
- `POST: api/user/reset-password`

### Client

On the client we provide useful hooks and providers to integrate with the M3O User API.

Within your `_app.(tsx|jsx)` you will need to import our `<UserProvider />` component. This will handle your authentication state:

```javascript
import { UserProvider } from '@m3o/nextjs'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const { user } = pageProps

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
```

By providing the user to `<UserProvider />`, we're able to share the user across the application without the need to add this to each layout.
