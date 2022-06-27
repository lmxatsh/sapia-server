import mongoose from 'mongoose'

const SigninHistory = mongoose.model(
  'SigninHistory',
  new mongoose.Schema(
    {
      username: String,
      status: String,
    },
    { timestamps: true }
  ),
  'sign_history'
)

export default SigninHistory
