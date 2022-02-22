import M3O from 'm3o'

let m3o = M3O('MDQ3Nzk5YWQtOWM5OS00OTIzLWE4MTItMzA4MTMzMzY0OTc1')

console.log(m3o)

let clientCode = document.getElementById('client-code')
let widgetRenderer = document.getElementById('widget-renderer')

clientCode.oninput = (event) => {
  widgetRenderer.innerHTML = event.target.value
}
