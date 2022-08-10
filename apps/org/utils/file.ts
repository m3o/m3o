export function downloadFile(data: string, name: string): Promise<void> {
  return new Promise(resolve => {
    const element = document.createElement('a')

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(data),
    )

    element.setAttribute('download', `${name}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    resolve()
  })
}
