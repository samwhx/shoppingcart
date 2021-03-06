//load libraries
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
//const cors = require('cors') //only used when there is a cross-origin request. e.g. diff ports

//start application and others
const app = express()
// app.use(cors)

//predefined data
let db = {}

//routes
//GET /api/cart
app.get('/api/cart', (req, res) => {
  const name = req.query.name
  if (!name || !db[name]) {
    res.status(406).json({ error: 'You do not have a saved cart!'})
  }
  else {
    res.status(202).format({
      json: () => {res.json({name: name, content: db[name].cart, saved: db[name].date})}
    })
  }
})
//POST /api/cart
app.post('/api/cart', bodyParser.json(), bodyParser.urlencoded(), (req, res) => {
  const name = req.body.name
  data = {
    "cart" : req.body.content,
    "date" : new Date()
  }
  db[name] = data
  console.info (db)
  res.status(201).format({
    json: () => {res.json({})}
  })
})
// default route
app.use(express.static(path.join(__dirname, 'public')))

//listen
PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
app.listen (PORT, () => {
  console.info (`Application started on port ${PORT}`)
})