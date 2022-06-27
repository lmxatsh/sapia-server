import express from 'express'
import config from './config/config.js'
import mongoose from 'mongoose'
import usersRouter from './routes/users.route.js'
import indexRouter from './routes/index.route.js'

const app = express()

const PORT = config.app.port

const mongoUri =
  `mongodb://${config.mongodb.user}:${config.mongodb.passwd}` +
  `@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.name}`

console.log(mongoUri)

const mongoOptions = {
  useNewUrlParser: true, // To use the new parser rather than the depreciated one
  useUnifiedTopology: true, // To use the new Server Discover and Monitoring engine
  authSource: 'sapia', //specify authentication database
}

mongoose
  .connect(mongoUri, mongoOptions)
  .then(() => {
    console.log(
      `Connect to ${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.name}} Successfully`
    )
  })
  .catch((err) => {
    console.error(`Connect Error: ${err}`)
    process.exit()
  })

app.use(express.json())

app.get('/', indexRouter)
app.use('/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Running on http://127.0.0.1:${PORT}`)
})
