//import { jest } from '@jest/globals' not reuired if babel is used
import { signup, signin, getUser } from '../users.controllers'

//mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: (a1, a2) => {
    return new Promise((res, rej) => {
      res(a1 === a2)
    })
  },
  hashSync: (a1, a2) => a1,
}))

//mock models
jest.mock('../../models/index.js', () => {
  return {
    User: {
      findOne: ({ username }) => {
        return new Promise((res, rej) => {
          const data = {
            blockeduser: {
              username: 'blockeduser',
              password: '123',
              status: 'blocked',
            },
            activeuser: {
              username: 'activeuser',
              password: '123',
              status: 'active',
            },
            blockedWithin1h: {
              username: 'blockedWithin1h',
              password: '123',
              status: 'blocked',
            },
            blockedBefore1h: {
              username: 'blockedBefore1h',
              password: '123',
              status: 'blocked',
            },
          }
          res(data[username] || null)
        })
      },
      create: (data) => {
        return new Promise((res, rej) => {
          res(data)
        })
      },
      findOneAndUpdate: (data) => {
        return new Promise((res, rej) => {
          res(data)
        })
      },
    },

    SigninHistory: {
      findOne: ({ username }) => {
        return new Promise((res, rej) => {
          const data = {
            blockeduser: {
              username: 'blockeduser',
              password: '123',
              status: 'blocked',
            },
            activeuser: {
              username: 'activeuser',
              password: '123',
              status: 'active',
            },
            blockedWithin1h: {
              username: 'blockedWithin1h',
              password: '123',
              status: 'blocked',
            },
          }
          res(data[username] || null)
        })
      },
      create: (data) => {
        return new Promise((res, rej) => {
          res(data)
        })
      },
      count: (data) => {
        return new Promise((res, rej) => {
          res(data.username === 'blockeduser' ? 5 : 1)
        })
      },
    },
  }
})

describe('test controller for /users', () => {
  //beforeAll(() => {})
  //beforeEach(() => {})
  //afterAll(() => {})

  const mockReq = { body: { username: 'newuser', password: '123' } }
  const mockRes = {
    status: (code) => ({ send: (data) => ({ ...data, status: code }) }),
  }
  const mockNext = jest.fn()

  describe('test the controller of signup', () => {
    test('return 201 when username and password are given', async () => {
      const res = await signup(mockReq, mockRes, mockNext)
      expect(res.status).toBe(201)
    })

    test('return 409 when username already exists', async () => {
      const mockReq = { body: { username: 'activeuser', password: '123' } }
      //console.log(mockReq)
      const res = await signup(mockReq, mockRes, mockNext)
      expect(res.status).toBe(409)
    })

    test('return 400 when username/password is missing in the request', async () => {
      const mockReq = { body: { username: 'user' } }
      const res = await signup(mockReq, mockRes, mockNext)
      expect(res.status).toBe(400)
    })
  })

  describe('test the controller of signin', () => {
    test('return 400 when username/password is missing in the request', async () => {
      const mockReq = { body: { username: 'user' } }
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(400)
    })

    test('return 422 when username does not exist', async () => {
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(422)
    })

    test('return 200 and token when user signin successfully', async () => {
      const mockReq = { body: { username: 'activeuser', password: '123' } }
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(200)
      expect(res.token).toBeDefined()
    })

    test('return 401 when providing incorrect password', async () => {
      const mockReq = { body: { username: 'activeuser', password: '12345' } }
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(401)
      expect(res.error).toEqual('incorrect password')
    })

    test('return 200 and token when blocked user retries after 1h and signin successfully', async () => {
      const mockReq = {
        body: { username: 'blockedBefore1h', password: '123' },
      }
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(200)
      expect(res.token).toBeDefined()
    })

    test('return 401 when user is blokced', async () => {
      const mockReq = { body: { username: 'blockedWithin1h', password: '123' } }
      const res = await signin(mockReq, mockRes, mockNext)
      expect(res.status).toBe(401)
      expect(res.error).toEqual('blocked')
    })
  })
})
