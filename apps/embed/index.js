let express = require('express')
let { engine } = require('express-handlebars')
let http = require('http')

let app = express()
let server = http.createServer(app)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home', {
    name: 'home'
  })
})

server.listen(1234, () => {
  console.log('Listening on 1234')
})
