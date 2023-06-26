import useSWR from 'swr'
import { Message } from './message'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  current_user?: boolean
  chat: {
    last_seen?: number | string
    messages?: Message[]
  }
}

export interface SignupParams {
  first_name: string
  last_name: string
  email: string
  password: string
  code?: string
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.status === 200 || res.status === 201) {
      return res.json()
    } else {
      throw `Error: ${res.statusText}`
    }
  })

export function useUser(): { user?: User; loading: boolean; error: Error } {
  const { data, error } = useSWR('/api/profile', fetcher)

  return {
    user: error ? undefined : data?.user,
    loading: !error && !data,
    error: error,
  }
}

export function login(email: string, password: string): Promise<User> {
  return new Promise<User>((resolve: Function, reject: Function) => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(body)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}

export function updateUser(user: User): Promise<null> {
  return new Promise<null>((resolve: Function, reject: Function) => {
    const params = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
    fetch('/api/profile', { method: 'PATCH', body: JSON.stringify(params) })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(null)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}

export function logout(): { loading: boolean; error: Error } {
  // TODO: fix
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error } = useSWR('/api/logout', fetcher)

  return {
    loading: !error && !data,
    error: error,
  }
}

export function signup(params: SignupParams): Promise<User> {
  return new Promise<User>((resolve: Function, reject: Function) => {
    fetch('/api/signup', { method: 'POST', body: JSON.stringify(params) })
      .then(async (rsp) => {
        try {
          const body = await rsp.json()
          rsp.status === 200
            ? resolve(body)
            : reject(body.error || rsp.statusText)
        } catch {
          rsp.status === 200 ? resolve({}) : reject(rsp.statusText)
        }
      })
      .catch((err) => reject(err))
  })
}

export function deleteProfile(): Promise<null> {
  return new Promise<null>((resolve: Function, reject: Function) => {
    fetch('/api/profile', { method: 'DELETE' })
      .then(async (rsp) => {
        try {
          const body = await rsp.json()
          rsp.status === 200
            ? resolve(null)
            : reject(body.error || rsp.statusText)
        } catch {
          rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
        }
      })
      .catch((err) => reject(err))
  })
}

export function sendPasswordReset(email: string): Promise<null> {
  return new Promise<null>((resolve: Function, reject: Function) => {
    fetch('/api/sendPasswordReset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
      .then(async (rsp) => {
        try {
          const body = await rsp.json()
          rsp.status === 200
            ? resolve(null)
            : reject(body.error || rsp.statusText)
        } catch {
          rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
        }
      })
      .catch((err) => reject(err))
  })
}

export function verifyPasswordReset(
  email: string,
  code: string,
  password: string
): Promise<null> {
  return new Promise<null>((resolve: Function, reject: Function) => {
    fetch('/api/verifyPasswordReset', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    })
      .then(async (rsp) => {
        try {
          const body = await rsp.json()
          rsp.status === 200
            ? resolve(null)
            : reject(body.error || rsp.statusText)
        } catch {
          rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
        }
      })
      .catch((err) => reject(err))
  })
}
