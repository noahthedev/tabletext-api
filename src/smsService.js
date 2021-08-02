const express = require('express')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const smsService = express()
const jsonParser = express.json()

smsService
  .route('/')
  .post(jsonParser, (req, res) => {
    const { phone } = req.body;
    client.messages
      .create({
        body: 'Your table is ready',
        from: '+12406182097',
        to: `${phone}`
      })
      .then(res.send(`SMS sent to ${phone}`))
  }) 

module.exports = smsService

