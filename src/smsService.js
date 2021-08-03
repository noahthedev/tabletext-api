const express = require('express')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

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
      .then(res.send('SMS sent'))
      .catch(err => console.log(err))
  }) 

module.exports = smsService

