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
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `${phone}`
      })
      .then(message => {
        if (message.sid) {
          res.send({
            "message":"SMS Sent"
          })
        }
        console.log(message)
      })
      .catch(err => {
        res.send({
          "message":"Message Not Sent"
        })
        console.log(err)
      })
    })

module.exports = smsService

 