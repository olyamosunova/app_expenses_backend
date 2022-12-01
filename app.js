const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json({ extended: true }))
app.use(cors())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/expense', require('./routes/expense.routes'))

if (process.env.REACT_APP_NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const server = http.createServer(app)

const PORT = process.env.REACT_APP_PORT

mongoose
  .connect(process.env.REACT_APP_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`),
    )
  })
  .catch(err => {
    console.log('Server Error', err.message)
    process.exit(1)
  })
