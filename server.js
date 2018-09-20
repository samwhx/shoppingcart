//load libraries
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
// const cors = require('cors') //only used when there is a cross-origin request. e.g. diff ports

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
  if (!name || !cart[name]) {
    res.status(406).send(`You do not have a saved cart!`).end()
  }
  else {
    res.status(202).format({
          'text/html' : () => {res.render('cart', { cart: cart[name], date:date[name], layout: 'index'})},
          // json: () => {res.json({name: name, content: cart[name], saved: date[name]})} for angular
    })
  }
})
//POST /api/cart
app.post('/api/cart', bodyParser.json(), bodyParser.urlencoded(), (req, res) => {
  const name = req.body.name
  if (!cart[name]) {
    cart[name] = []
    cart[name].push(req.body.content)
  }
  else {
    cart[name].push(req.body.content)
  }
  date[name] = new Date()
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