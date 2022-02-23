type StorageTypes = 'localStorage' | 'sessionStorage'

function Storage(type: StorageTypes) {
  function getItem(key: string): string | null {
    return window[type].getItem(key)
  }

  function setItem(key: string, value: string): void {
    window[type].setItem(key, value)
  }

  function deleteItem(key: string): void {
    window[type].removeItem(key)
  }

  return {
    getItem,
    setItem,
    deleteItem,
  }
}

// TODO: Rename so it doesn't clash with window.
export const sessionStorage = Storage('sessionStorage')
export const localStorage = Storage('localStorage')
