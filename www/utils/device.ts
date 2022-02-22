export function getDeviceName(userAgent: string): string {
  let device = 'Web'

  const ua: { [key: string]: RegExp } = {
    Linux: /Linux/i,
    Android: /Android/i,
    BlackBerry: /BlackBerry/i,
    Bluebird: /EF500/i,
    'Chrome OS': /CrOS/i,
    Datalogic: /DL-AXIS/i,
    Honeywell: /CT50/i,
    iPad: /iPad/i,
    iPhone: /iPhone/i,
    iPod: /iPod/i,
    macOS: /Macintosh/i,
    Windows: /IEMobile|Windows/i,
    Zebra: /TC70|TC55/i,
  }

  Object.keys(ua).map(v => userAgent.match(ua[v]) && (device = v))

  return device
}
