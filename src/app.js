require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')
const smsService = require('./smsService')
const waitlistRouter = require('./waitlist/waitlist-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('/waitlist', waitlistRouter)

app.use('/sms', smsService)

app.use(errorHandler)

module.exports = app