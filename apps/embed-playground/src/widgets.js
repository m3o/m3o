import './styles/globals.css'
import M3O from 'm3o'

let m3o = M3O('MjU4NTMyMDMtNTdlZS00ZGEyLTlhN2EtZWViZjQzMGQwYzBh')

function FormWidget(widgetId) {
  if (!widgetId) {
    throw new Error('Please provide a widget id')
  }

  let element = document.getElementById(widgetId)

  if (!element) {
    throw new Error('No element with this id found')
  }

  let form = element.querySelector('form')
  let responseElement = document.getElementById('hello-world-widget-response')

  form.onsubmit = async event => {
    event.preventDefault()

    let formData = new FormData(event.target)
    let name = formData.get('hello-world-widget-name')
    let response = await m3o.helloworld.call({ name })

    responseElement.innerHTML = response.message
  }
}

let helloWorldWidget = FormWidget('hello-world-widget')
