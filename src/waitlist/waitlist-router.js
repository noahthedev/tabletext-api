const express = require('express')
const path = require('path')
const WaitlistService = require('./waitlist-service')
const xss = require('xss')

const waitlistRouter = express.Router()
const jsonParser = express.json()

const serializeGuest = guest => ({
  id: guest.id,
  guestname: guest.guestname,
  guestcount: guest.guestcount,
  phone: guest.phone

})

waitlistRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    WaitlistService.getAllGuests(knexInstance)
      .then(guests => {
        res.json(guests.map(serializeGuest))
      })
  })

module.exports = waitlistRouter  

