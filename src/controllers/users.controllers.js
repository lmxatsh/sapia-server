import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, SigninHistory } from '../models/index.js'
//import User from '../models/user.model'
//import SigninHistory from '../models/signinhistory.model'
import config from '../config/config.js'

const SECRET = config.app.secret
const RETRY_TIME_LIMIT = config.app.retryTimeLimit
const RETRY_NUM_LIMIT = config.app.retryNumLimit
const RETRY_ALLOWED_AFTER = config.app.retryAllowedAfter
const TOKEN_EXPIRES_AFTER = config.app.tokenExpiresAfter

//return data for GET /users/:username
const getUser = async (req, res, next) => {
  try {
    const username = req.params.username
    const user = await User.findOne({ username })
    if (user && username === req.decoded.username) {
      return res.status(200).send({
        username: username,
        createdAt: user.createdAt,
      })
    } else {
      return res.status(401).send({ error: `unauthorized access` })
    }
  } catch (error) {
    next(error)
  }
}

const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).send({ error: 'invalid username/password' })
    }

    const user = await User.findOne({ username })
    if (user) {
      return res.status(409).send({
        username: username,
        signup: 'fail',
        error: 'user already exists',
      })
    } else {
      const data = await User.create({
        username: username,
        password: bcrypt.hashSync(password, 10),
        status: 'active',
      })
      if (data) {
        return res
          .status(201)
          .send({ username: data.username, signup: 'success' })
      }
    }
  } catch (error) {
    next(error)
  }
}

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).send({ error: 'invalid username/password' })
    }
    const user = await User.findOne({ username })
    //console.log(user)
    if (user) {
      if (user.status === 'active') {
        return await handleActiveUser(req, res, next, user)
      } else {
        return await handleBlockedUser(req, res, next, user)
      }
    } else {
      return res.status(422).send({
        username: username,
        signin: 'fail',
        error: `${username} not exist`,
      })
    }
  } catch (error) {
    next(error)
  }
}

const isSigninWithinHours = async (username, hours) => {
  try {
    const dateBefore = new Date(Date.now() - parseInt(hours[0]) * 3600000)
    //dateBefore.setHours(dateBefore.getHours() - hours)
    const signinRecord = await SigninHistory.findOne({
      username: username,
      createdAt: { $gte: dateBefore },
    })
    return signinRecord ? true : false
  } catch (error) {
    throw new Error(error)
  }
}

const countSigninFailedWithinMinutes = async (username, minutes) => {
  try {
    const dateBefore = new Date(Date.now() - parseInt(minutes[0]) * 60000)
    const count = await SigninHistory.count({
      username: username,
      status: 'fail',
      createdAt: { $gte: dateBefore },
    })
    return count ? count : 0
  } catch (error) {
    throw new Error(error)
  }
}

const handleActiveUser = async (req, res, next, user) => {
  try {
    const { username, password } = req.body
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (passwordIsValid) {
      await SigninHistory.create({
        username: username,
        status: 'success',
      })
      console.log(`${username} login successfully`)
      //res.status(200).send({ username: username, signin: 'success' })
      const token = jwt.sign({ username }, SECRET, {
        expiresIn: TOKEN_EXPIRES_AFTER,
      })
      if (token) {
        return res.status(200).send({
          username: username,
          token: token,
        })
      } else {
        return res.status(500).send({
          username: username,
          signin: 'fail',
          error: 'no token is created',
        })
      }
    } else {
      const hist = await SigninHistory.create({
        username: username,
        status: 'fail',
      })
      const failedTimes = await countSigninFailedWithinMinutes(
        username,
        RETRY_TIME_LIMIT
      )
      //console.log(failedTimes)
      if (hist && failedTimes >= RETRY_NUM_LIMIT) {
        console.log(`${username} failed more than 3 times`)
        await User.findOneAndUpdate(
          { username },
          { status: 'blocked' },
          {
            new: true,
          }
        )
      }
      return res.status(401).send({
        username: username,
        signin: 'fail',
        error: 'incorrect password',
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}

const handleBlockedUser = async (req, res, next, user) => {
  try {
    const result = await isSigninWithinHours(user.username, RETRY_ALLOWED_AFTER)
    if (result) {
      return res.status(401).send({
        username: user.username,
        signin: 'fail',
        error: 'blocked',
      })
    } else {
      await User.findOneAndUpdate(
        { username: user.username },
        { status: 'active' },
        {
          new: true,
        }
      )

      return await handleActiveUser(req, res, next, user)
    }
  } catch (error) {
    throw new Error(error)
  }
}

export { getUser, signin, signup }
