const app = require('../src/app')
const knex = require('knex')

describe('Waitlist API:', () => {
  let db;
  let waitlist = [
    {
      "guestname": "guest 1",
      "guestcount": 1,
      "phone": "+11234567890"
    },
    {
      "guestname": "guest 2",
      "guestcount": 2,
      "phone": "+11234567890"
    },
    {
      "guestname": "guest 3",
      "guestcount": 3,
      "phone": "+11234567890"
    },
    {
      "guestname": "guest 4",
      "guestcount": 4,
      "phone": "+11234567890"
    },
    
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  });

  before('cleanup', () => db.raw('TRUNCATE TABLE waitlist RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE waitlist RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy());

  describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!')
    })
  })

  describe('GET /waitlist', () => {
    
    beforeEach('insert some guests', () => {
      return db('waitlist').insert(waitlist);
    })

    it('should respond to GET `/waitlist` with an array of guests and status 200', () => {
      return supertest(app)
        .get('/waitlist')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(waitlist.length);
          res.body.forEach((guest) => {
            expect(guest).to.be.a('object');
            expect(guest).to.include.keys('id', 'guestname', 'guestcount', 'phone');
          });
        });
    });
  });

  describe('GET /waitlist/:id', () => {

    beforeEach('insert some guests', () => {
      return db('waitlist').insert(waitlist);
    })

    it('should return correct guest when provided an id', () => {
      let rep;
      return db('waitlist')
      .first()
      .then(_rep => {
        rep = _rep
        return supertest(app)
          .get(`/waitlist/${rep.id}`)
          .expect(200);
      })
      .then(res => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'guestname', 'guestcount', 'phone');
        expect(res.body.id).to.equal(rep.id);
        expect(res.body.guestname).to.equal(rep.guestname);
      });
    });

    it('should response with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/waitlist/123456789')
        .expect(404);
    });
  });

  describe('POST /waitlist', () => {

    it('should create and return a new guest when provided valid data', () => {
      const newGuest = {
        "guestname": "asdf",
        "guestcount": 2,
        "phone": "123456789"
      };

      return supertest(app)
        .post('/waitlist')
        .send(newGuest)
        .expect(201)
        .expect( res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'guestname', 'guestcount', 'phone');
          expect(res.body.guestname).to.equal(newGuest.guestname);
          expect(res.headers.location).to.equal(`/waitlist/${res.body.id}`)
        })
    })
  });

  describe('DELETE /waitlist/:id', () => {

    beforeEach('insert some guests', () => {
      return db('waitlist').insert(waitlist);
    })

    it('should delete a guest by id', () => {
      return db('waitlist')
        .first()
        .then(rep => {
          return supertest(app)
            .delete(`/waitlist/${rep.id}`)
            .expect(204);
        })
    });

    it('should respond with a 404 for an invalid id', () => {
      return supertest(app)
        .delete('/waitlist/123456789')
        .expect(404);
    });
  });
});
 
