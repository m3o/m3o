package handler

var WebTemplate = `
<html>
  <head>
    <title>M3O | Apps</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body { padding: 0; margin: 0; }
      .container {
	margin: 0 auto;
	text-align: center;
	padding: 50px;
	text-transform: capitalize;
	font-family: arial;
	background: whitesmoke;
	height: 100%;
      }
      .app {
	display: inline-block;
	position: relative;
	font-weight: bold;
        border: 2px solid grey;
	border-radius: 10px;
	padding: 25px;
	background: white;
	color: black;
	text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div id="header"><h1>Apps</h1></div>
      {{range .}}
        <a class="app" href="{{.Url}}">{{.Name}}</a>
      {{end}}
    </div>
  </body>
</html>
`
