import express from 'express'

const indexRouter = express.Router()

indexRouter.get('/', async (req, res) => {
  res.send('hello world')
})

export default indexRouter
