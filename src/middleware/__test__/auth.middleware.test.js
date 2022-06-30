//import { jest } from '@jest/globals'
import { verifyToken } from '../auth.middleware'

let verifyRsult = ''

jest.mock('jsonwebtoken', () => ({
  verify: (token) => {
    if (token === 'jwttoken') {
      verifyRsult = 'next'
    } else {
      verifyRsult = {
        status: 401,
        error: `invalid token`,
      }
    }
  },
  sign: () => {
    return 'jwt_token'
  },
  mock: 'mock',
}))

describe('test controller of auth', () => {
  beforeEach(() => {
    verifyRsult = ''
  })
  const mockReq = {
    headers: { authorization: 'bearer jwttoken' },
    body: { username: 'newuser', password: '123' },
  }
  const mockRes = {
    status: (code) => ({ send: (data) => ({ ...data, status: code }) }),
  }
  const mockNext = jest.fn()

  test('return token if providing authorization in the header', () => {
    verifyToken(mockReq, mockRes, mockNext)
    expect(verifyRsult).toEqual('next')
  })

  test('return 401 if not providing authorization in the header', () => {
    const mockReq = {
      headers: {},
      body: { username: 'newuser', password: '123' },
    }
    const res = verifyToken(mockReq, mockRes, mockNext)
    expect(res.status).toEqual(401)
    expect(res.error).toEqual('unauthorized access')
  })

  test('return 401 if providing incorrect token in the header', () => {
    const mockReq = {
      headers: { authorization: 'bearer incorrecttoken' },
      body: { username: 'newuser', password: '123' },
    }
    verifyToken(mockReq, mockRes, mockNext)
    expect(verifyRsult.status).toEqual(401)
    expect(verifyRsult.error).toEqual('invalid token')
  })
})
