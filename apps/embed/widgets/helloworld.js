let widget = document.getElementById('m3o-helloworld-widget')
let frame = document.createElement('iframe')
frame.src =
  '/widgets/hello-world.html?key=MjU4NTMyMDMtNTdlZS00ZGEyLTlhN2EtZWViZjQzMGQwYzBh'
frame.width = '500px'
frame.height = '250px'
widget.appendChild(frame)
