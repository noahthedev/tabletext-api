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
  .post(jsonParser, (req, res, next) => {
    const { guestname, guestcount, phone } = req.body

    const newGuest = { guestname, guestcount, phone }

    WaitlistService.insertGuest(
      req.app.get('db'), newGuest
    )
      .then(guest => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${guest.id}`))
          .json(serializeGuest(guest))
      })
      .catch(next)
  })

  waitlistRouter
    .route('/:id')
    .all((req, res, next) => {
      const knexInstance = req.app.get('db')
      WaitlistService.getById(
        knexInstance,
        req.params.id
      )
        .then(guest => {
          if (!guest) {
            return res.status(404).json({
              error: { message: `Guest doesn't exist` }
            })
          }
          res.guest = guest
          .next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeGuest(res.guest))
    })
    .delete((req, res, next) => {
      const knexInstance = req.app.get('db')
      WaitlistService.deleteGuest(
        knexInstance,
        req.params.id
      )
      .then(res.status(204).end())
      .catch(next)
    })

module.exports = waitlistRouter  

