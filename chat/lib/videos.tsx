export interface VideoProfile {
  identity: string
  token: string
}

export function getVideoProfile(): Promise<VideoProfile> {
  return new Promise<VideoProfile>((resolve: Function, reject: Function) => {
    fetch('/api/video', { method: 'GET' })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(body)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}
