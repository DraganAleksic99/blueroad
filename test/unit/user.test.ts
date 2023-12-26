// @ts-nocheck

import sinon from 'sinon'
import chai from 'chai'
import sinonTest from 'sinon-test'
import userModel from '../../src/models/user.model'
import userController from '../../src/controllers/user.controller'

const { expect } = chai
const test = sinonTest(sinon)

describe('User Controller Tests', () => {
  const req = {
    body: {
      name: 'test',
      email: 'test@test.com',
      password: 'test123'
    },
    params: {
      id: '658b36df104fed68cd49985c'
    }
  }
  let res, resSpy, jsonSpy

  describe('list', () => {
    beforeEach(function () {
      resSpy = sinon.spy()
      jsonSpy = sinon.spy()
      res = {
        json: jsonSpy,
        status: sinon.stub().returns({ json: resSpy })
      }
    })

    it(
      'It should return all users ',
      test(async () => {
        const stub = sinon.stub(userModel, 'find').returns({ select: sinon.stub().resolves([]) })

        await userController.list(req, res)

        expect(stub.calledOnce).to.be.true
        expect(jsonSpy.calledOnce).to.be.true
        expect(jsonSpy.calledWith([])).to.be.true

        stub.restore()
      })
    )

    it(
      'It should return an error when userModel.find() method fails ',
      test(async () => {
        const stub = sinon
          .stub(userModel, 'find')
          .returns({ select: sinon.stub().rejects({ code: 11000 }) })

        await userController.list(req, res)

        expect(stub.calledOnce).to.be.true
        expect(res.status.calledWith(400)).to.be.true
        expect(resSpy.calledOnce).to.be.true
        expect(resSpy.calledWith({ error: 'Unique field already exists' })).to.be.true

        stub.restore()
      })
    )
  })

  describe('userById', () => {
    beforeEach(function () {
      resSpy = sinon.spy()
      jsonSpy = sinon.spy()
      res = {
        json: jsonSpy,
        status: sinon.stub().returns({ json: resSpy })
      }
    })

    it(
      'It should find a user by the given id',
      test(async () => {
        const nextSpy = sinon.spy()
        const stub = sinon.stub(userModel, 'findById')

        stub.withArgs(req.params.id).returns(req.body)

        await userController.userById(req, res, nextSpy, req.params.id)

        expect(stub.calledOnce).to.be.true
        expect(stub.calledWith(req.params.id)).to.be.true
        expect(nextSpy.calledOnce).to.be.true
        expect(res.status.calledWith(400)).to.be.false

        stub.restore()
      })
    )

    it(
      'It should return an error if the found user is null',
      test(async () => {
        const nextSpy = sinon.spy()
        const stub = sinon.stub(userModel, 'findById')

        stub.withArgs(req.params.id).returns(null)

        await userController.userById(req, res, nextSpy, req.params.id)

        expect(stub.calledOnce).to.be.true
        expect(stub.calledWith(req.params.id)).to.be.true
        expect(nextSpy.calledOnce).to.be.false
        expect(res.status.calledWith(400)).to.be.true
        expect(resSpy.calledOnce).to.be.true
        expect(resSpy.calledWith({ error: 'User not found' })).to.be.true

        stub.restore()
      })
    )

    it(
      'It should return an error if the userModel.findById() method fails',
      test(async () => {
        const nextSpy = sinon.spy()
        const stub = sinon.stub(userModel, 'findById')

        stub.withArgs(req.params.id).rejects({ code: 11000 })

        await userController.userById(req, res, nextSpy, req.params.id)

        expect(stub.calledOnce).to.be.true
        expect(stub.calledWith(req.params.id)).to.be.true
        expect(nextSpy.calledOnce).to.be.false
        expect(res.status.calledWith(400)).to.be.true
        expect(resSpy.calledOnce).to.be.true
        expect(resSpy.calledWith({ error: 'Could not retrieve the user' })).to.be.true

        stub.restore()
      })
    )
  })
})
