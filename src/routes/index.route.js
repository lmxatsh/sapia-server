import express from 'express'

const indexRouter = express.Router()

indexRouter.get('/', async (req, res) => {
  res.send('Sapia Demo Project')
})

export default indexRouter
