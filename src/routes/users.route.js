import express from 'express'
import * as users from '../controllers/users.controllers.js'
import { returnToken, verifyToken } from '../middleware/auth.middleware.js'

const usersRouter = express.Router()

usersRouter.get('/:username', verifyToken, users.getUser)
usersRouter.post('/signup', users.signup)
usersRouter.post('/signin', users.signin, returnToken)

export default usersRouter
