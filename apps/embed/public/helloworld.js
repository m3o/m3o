let { 1: key } = document.currentScript.src.split('key=')

if (!key) {
  throw new Error('No key provided')
}

document.write(
  `<iframe src="https://embed.m3o.com/hello-world.html?key=${key}" width="500" height="300"></iframe>`
)
