import mongoose from 'mongoose'

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: {
        type: String,
        unique: true,
      },
      password: String,
      status: String,
    },
    { timestamps: true }
  ),
  'users'
)

export default User
