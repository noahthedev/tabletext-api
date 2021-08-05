# [TableText](https://tabletext.vercel.app/)

## Summary 

This Express app serves as the backend for the TableText React client which you can find [here](https://github.com/noahthedev/tabletext-client). Together, these apps help restaurants keep a waiting list from which they can directly send an SMS to guests when their table is ready.

## Tech Stack

This project was created using 
* Node.js
* Express
* PostgreSQL
* Twilio API

## API Endpoints

- GET & POST - /waitlist
- PATCH & DELETE - /waitlist/:id
- POST (send SMS) - /sms
