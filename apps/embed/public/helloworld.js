let { 1: key = 'MWE1Y2RjMmUtZjdkYi00NjFhLWI1YzktYjc4Y2MxYmEyMzA2' } =
  document.currentScript.src.split('key=')

console.log(key)

document.write(
  `<iframe src="https://embed.m3o.com/hello-world.html?key=${key}" width="500" height="300"></iframe>`
)
