import express from 'express'
import * as users from '../controllers/users.controllers.js'

const usersRouter = express.Router()

//usersRouter.get('/:username', users.getuser)
usersRouter.post('/signup', users.signup)
usersRouter.post('/signin', users.signin)

export default usersRouter
