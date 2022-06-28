import bcrypt from 'bcryptjs'
import { User, SigninHistory } from '../models/index.js'

const getUser = async () => {}

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
    if (user) {
      if (user.status === 'active') {
        handleActiveUser(req, res, next, user)
      } else {
        handleBlockedUser(req, res, next, user)
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
    const dateBefore = new Date(Date.now() - hours * 3600000)
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
    const dateBefore = new Date(Date.now() - minutes * 60000)
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
      console.log('login successfully')
      res.status(200).send({ username: username, signin: 'success' })
      next() // return JWT in the following step
    } else {
      const hist = await SigninHistory.create({
        username: username,
        status: 'fail',
      })
      const failedTimes = await countSigninFailedWithinMinutes(username, 5)
      if (hist && failedTimes >= 3) {
        console.log('fail more than 3 times')
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
    const result = await isSigninWithinHours(user.username, 0.02)
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
      handleActiveUser(req, res, next, user)
    }
  } catch (error) {
    throw new Error(error)
  }
}

export { getUser, signin, signup }
