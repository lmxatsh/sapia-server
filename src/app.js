import express from 'express'
import usersRouter from './routes/users.route.js'
import indexRouter from './routes/index.route.js'

const app = express()

app.use(express.json())
app.get('/', indexRouter)
app.use('/users', usersRouter)

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).send({ error: 'not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send({ error: err })
})

export default app
