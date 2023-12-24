import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/express'
import { connectDb } from '../../src/server'
import userModel from '../../src/models/user.model'

const { expect } = chai

chai.use(chaiHttp)

connectDb()

describe('User APIs', () => {
  beforeEach(done => {
    userModel
      .deleteOne()
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.error(err)
      })
    done()
  })

  describe('Test GET route /api/users', () => {
    it('It should return all users', done => {
      chai
        .request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(0)
          done()
        })
    })

    describe('Test POST route /api/users', () => {
      it('It should create a user', done => {
        const user = {
          name: 'test',
          email: 'test@test.com',
          password: 'test123'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('message').eql('Succesfully signed up')
            done()
          })
      })

      it('It should NOT create a user when property name is missing', done => {
        const user = {
          email: 'test@test.com',
          password: 'test123'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('error').eql('Name is required')
            done()
          })
      })

      it('It should NOT create a user when property email is missing', done => {
        const user = {
          name: 'test',
          password: 'test123'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('error').eql('Email is required')
            done()
          })
      })

      it('It should NOT create a user when property email is not a valid email', done => {
        const user = {
          name: 'test',
          email: 'unvalidEmailAddress',
          password: 'test123'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('error').eql('Please fill a valid email address')
            done()
          })
      })

      it('It should NOT create a user when property password is missing', done => {
        const user = {
          name: 'test',
          email: 'test@test.com'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('error').eql('Password is required')
            done()
          })
      })

      it('It should NOT create user when property password has less than six characters', done => {
        const user = {
          name: 'test',
          email: 'test@test.com',
          password: '12345'
        }
        chai
          .request(app)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('Object')
            expect(res.body)
              .to.have.property('error')
              .eql('Password must be at least 6 characters.')
            done()
          })
      })
    })
  })

  describe('Test GET route /api/users/:userId', () => {
    it('It should return the user by the given id', async () => {
      const user = new userModel({ name: 'test', email: 'test@test.com', password: 'test123' })
      await user.save()

      chai
        .request(app)
        .get('/api/users/' + user.id)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('Object')
          expect(res.body).to.have.property('_id').eql(user.id)
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('email')
          expect(res.body).to.have.property('created')
        })
    })
  })

  describe('Test PUT route /api/users/:userId', () => {
    it('It should update the user by the given id', done => {
      const user = new userModel({ name: 'test', email: 'test@test.com', password: 'test123' })
      user
        .save()
        .then(() => {
          chai
            .request(app)
            .put('/api/users/' + user.id)
            .send({ name: 'changed', email: 'changed@test.com', password: 'changed' })
            .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body).to.be.an('Object')
              expect(res.body).to.have.property('name').eql('changed')
              expect(res.body).to.have.property('email').eql('changed@test.com')
              expect(res.body).to.have.property('updated')
              done()
            })
        })
        .catch(error => {
          console.log(error)
        })
    })
  })

  describe('Test DELETE route /api/users/:userId', () => {
    it('It should delete the user by the given id', done => {
      const user = new userModel({ name: 'test', email: 'test@test.com', password: 'test123' })
      user.save().then(() => {
        chai
          .request(app)
          .delete('/api/users/' + user.id)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('acknowledged').eql(true)
            expect(res.body).to.have.property('deletedCount').eql(1)
            done()
          })
      })
    })
  })
})
