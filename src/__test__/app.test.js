import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../models/index.js'
import bcrypt from 'bcryptjs'
import supertest from 'supertest'
import app from '../app.js'

test('', () => {
  expect(1).toEqual(1)
})

const server = app.listen(3000)
const request = supertest(app)
let mongoDB = null

const connectDB = async () => {
  try {
    mongoDB = await MongoMemoryServer.create()
    const dbUrl = mongoDB.getUri()
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    await mongoDB.stop()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const clearDB = async () => {
  const collections = mongoose.connection.collections
  for (let key in collections) {
    await collections[key].deleteMany()
  }
}

describe('integration test for app', () => {
  beforeAll(async () => {
    console.log('connect to DB')
    await connectDB()
  })

  beforeEach(async () => {
    //console.log('clear data')
    await clearDB()
  })

  afterAll(async () => {
    console.log('disconnect to DB and stop server')
    await disconnectDB()
    server.close()
  })

  describe('test signup via /users/signup', () => {
    test('return 201 when sending POST request with valid data', async () => {
      const data = {
        username: 'test',
        password: '123456',
      }
      const res = await request.post('/users/signup').send(data)
      expect(res.status).toBe(201)
      expect(res.body.username).toBe('test')
    })

    test('return 400 when sending POST request with invalid data', async () => {
      const data = {
        username: 'test',
      }
      const res = await request.post('/users/signup').send(data)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('invalid username/password')
    })

    test('return 409 when sending POST request with username already exists', async () => {
      const data = {
        username: 'test',
        password: '123456',
      }
      await User.create({
        username: 'test',
        password: '123',
        status: 'active',
      })
      const res = await request.post('/users/signup').send(data)
      expect(res.status).toBe(409)
      expect(res.body.error).toBe('user already exists')
    })
  })

  describe('test signin via /users/signin', () => {
    test('return 400 when sending POST request with invalid data', async () => {
      const data = {
        username: 'test',
      }
      const res = await request.post('/users/signin').send(data)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('invalid username/password')
    })

    test('return 200 and token when users signin successfully', async () => {
      const data = {
        username: 'test',
        password: '123',
      }
      await User.create({
        username: 'test',
        password: bcrypt.hashSync('123', 10),
        status: 'active',
      })

      const res = await request.post('/users/signin').send(data)
      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
    })

    test('return 401 and when users signin with incorrect password', async () => {
      const data = {
        username: 'test',
        password: '1234',
      }
      await User.create({
        username: 'test',
        password: bcrypt.hashSync('123', 10),
        status: 'active',
      })

      const res = await request.post('/users/signin').send(data)
      expect(res.status).toBe(401)
      expect(res.body.error).toEqual('incorrect password')
    })

    test('return 401 and when users fail to signin three times in 5 minutes', async () => {
      const data = {
        username: 'test',
        password: '1234',
      }
      await User.create({
        username: 'test',
        password: bcrypt.hashSync('123', 10),
        status: 'active',
      })
      await request.post('/users/signin').send(data)
      await request.post('/users/signin').send(data)
      await request.post('/users/signin').send(data)
      const res4 = await request.post('/users/signin').send(data)
      expect(res4.status).toBe(401)
      expect(res4.body.error).toEqual('blocked')
    })
  })

  describe('test access user data via /users/:user', () => {
    test('return 200 and {username, createdAt} when sending GET request with valid token', async () => {
      const data = {
        username: 'test',
        password: '123',
      }
      await User.create({
        username: data.username,
        password: bcrypt.hashSync(data.password, 10),
        status: 'active',
      })

      const signinRes = await request.post('/users/signin').send(data)
      const res = await request
        .get(`/users/${data.username}`)
        .set('Authorization', `Bearer ${signinRes.body.token}`)
      expect(res.status).toBe(200)
      expect(res.body.username).toEqual(data.username)
      expect(res.body.createdAt).toBeDefined
    })
    test('return 401 when sending GET request with invalid token', async () => {
      const res = await request.get(`/users/test`)
      expect(res.status).toEqual(401)
      expect(res.body.error).toEqual(`unauthorized access`)
    })
  })

  test('return 404 when access resource via invalid URL', async () => {
    const invalidUrl = '/nowhere'
    const res = await request.get(invalidUrl)
    expect(res.status).toEqual(404)
  })
})
