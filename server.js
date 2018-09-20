//load libraries
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const cors = require('cors') //only used when there is a cross-origin request. e.g. diff ports

//start application and others
const app = express()
app.engine('handlebars', hbs({ defaultLayout: 'index'}))
app.set('view engine', 'handlebars')
// app.use(cors)

//predefined data
let cart = {}
let date = {}

//routes
//default route redirect to hbs
app.get('/', (req, res) => {
  res.status(200).render('cart', {layout: 'index'})
})

//GET /api/cart
app.get('/api/cart', (req, res) => {
  const name = req.query.name
  if (name == undefined || cart[name] == undefined) {
    res.status(406).send(`You do not have a saved cart!`).end()
  }
  else {
    res.status(202).format({
          'text/html' : () => {res.render('cart', { cart: cart[name], date:date[name], layout: 'index'})},
          // json: () => {res.json({name: name, content: specificCart, saved: specificDate})} for angular
    })
  }
})
//POST /api/cart
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.post('/api/cart', (req, res) => {
  console.info(req.body)
  const name = req.body.name
  const content = req.body.content
  const currentDate = new Date()
  if (cart[name] == undefined) {
    temp_array = []
    temp_array.push(content)
    cart[name] = temp_array
  }
  else {
    cart[name].push(content)
  }
  console.info(cart[name])
  date[name] = currentDate
  res.status(201).format({
        'text/html' : () => {res.render('cart', { cart: cart[name], date: date[name], layout: 'index'})}
        // json: () => {res.json({})} for angular
  })
})
// default route
app.use(express.static(path.join(__dirname, 'public')))

//listen
PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
app.listen (PORT, () => {
  console.info (`Application started on port ${PORT}`)
})