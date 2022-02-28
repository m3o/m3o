let express = require('express')
let { engine } = require('express-handlebars')
let http = require('http')


let app = express()
let server = http.createServer(app)
let port = 3003;

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)

// Static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home', {
    name: 'home'
  })
})

server.listen(port, () => {
  console.log(`Listening on ${port}`)
})
