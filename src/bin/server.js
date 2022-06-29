import app from '../app.js'
import config from '../config/config.js'
import mongoose from 'mongoose'

const PORT = config.app.port

const mongoUri = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.name}`

const mongoOptions = {
  user: config.mongodb.user,
  pass: config.mongodb.passwd,
  useNewUrlParser: true, // To use the new parser rather than the depreciated one
  useUnifiedTopology: true, // To use the new Server Discover and Monitoring engine
  authSource: 'admin', //specify authentication database
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

app.listen(PORT, () => {
  console.log(`Running on http://127.0.0.1:${PORT}`)
})
