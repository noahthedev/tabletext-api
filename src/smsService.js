const express = require('express')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const smsService = express()

smsService
  .get('/', (req, res) => {
    client.messages
      .create({
        body: 'Your table is ready',
        from: '+12406182097',
        to: '+18152577009'
      })
      .then(res.send('SMS sent'))
  })

module.exports = smsService

