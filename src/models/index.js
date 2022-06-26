import mongoose from 'mongoose'
import SigninHistory from './signinhistory.model.js'
import User from './user.model.js'

const db = {
  mongoose: mongoose,
  User: User,
  SigninHistory: SigninHistory,
}

export default db
