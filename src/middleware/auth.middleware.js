import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const secret = config.app.secret

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader ? req.headers.authorization.split(' ')[1] : null
    console.log(token)
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          console.log(decoded)
          return res.status(401).send({ error: `invalid token` })
        }
        req.decoded = decoded
        next()
      })
    } else {
      return res.status(401).send({ error: `unauthorized access` })
    }
  } catch (error) {
    next(error)
  }
}

const returnToken = (req, res, next) => {
  try {
    const token = jwt.sign({ username: req.body.username }, secret, {
      expiresIn: '1h',
    })
    if (token) {
      return res.status(200).send({
        username: res.locals.username,
        token: token,
      })
    }
  } catch (error) {
    next(error)
  }
}

export { verifyToken, returnToken }
