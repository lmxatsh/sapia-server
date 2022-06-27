import { User } from '../models/index.js'

const verifyInput = (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).send({ error: 'invalid username/password' })
    } else {
      console.log(`verifyInput`)
      next()
    }
  } catch (error) {
    next(error)
  }
}

const signinCheckUserExists = async (req, res, next) => {
  try {
    const username = req.body.username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(422).send({ error: 'user not exist' })
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

export { verifyInput, signinCheckUserExists }
