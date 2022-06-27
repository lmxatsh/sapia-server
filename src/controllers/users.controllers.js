import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'

const getUser = async () => {}

const signup = async (req, res, next) => {
  console.log(`signin`)
  try {
    console.log(`signin`)
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
      return res.status(422).send({
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
        res.status(201).send({ username: data.username, signup: 'success' })
      }
    }
  } catch (error) {
    next(error)
  }
}

const signin = async () => {}

export { getUser, signin, signup }
