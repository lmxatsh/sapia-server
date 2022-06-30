import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const SECRET = config.app.secret
const TOKEN_EXPIRES_AFTER = config.app.tokenExpiresAfter

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader ? req.headers.authorization.split(' ')[1] : null
    if (token) {
      jwt.verify(token, SECRET, (err, decoded) => {
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
    const payload = req.params.payload || { sapia: 'sapia' }
    const token = jwt.sign(payload, SECRET, {
      expiresIn: TOKEN_EXPIRES_AFTER,
    })
    if (token) {
      return res.status(200).send({
        ...payload,
        token: token,
      })
    }
  } catch (error) {
    next(error)
  }
}

export { verifyToken, returnToken }
