export function readme(name: string, description: string = '') {
  const length = 80
  const lines = description.split('\n')

  if (
    lines.length > 1 &&
    lines[0].toLocaleLowerCase().startsWith('# ' + name)
  ) {
    return lines
      .slice(1)
      .filter(line => !line.startsWith('#'))
      .join('\n')
      .slice(0, length)
  }

  return lines[0].slice(0, length)
}
