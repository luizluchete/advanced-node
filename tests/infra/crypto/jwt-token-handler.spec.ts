
import { JwtTokenHandler } from '@/infra/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number
    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt = jwt as jest.Mocked<typeof jwt>
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('Should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('Should call sign return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toEqual(token)
    })

    it('Should rethrow if sign return throw ', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
      const promise = sut.generateToken({ key, expirationInMs: 1000 })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('validateToken', () => {
    let token: string
    let key: string
    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => {
        return { key }
      })
    })

    it('Should call sign with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('Should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token })

      expect(generatedKey).toBe(key)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('Should rethrow if vefify return throw ', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('Should throw if vefify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })

    it('Should throw if vefify returns undefied', async () => {
      fakeJwt.verify.mockImplementationOnce(() => undefined)

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })
  })
})
