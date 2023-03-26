//it is important that .env gets important before the blog model
//this ensures environment variables from the .env are available globally
//before the code from other modules is imported.
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(
    logger.info('connected to MongoDB')
  )
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())


app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)


//has to be one before the last, otherwise unknown end point gets executed
//which returns a response so nothing else happens..
app.use(middleware.unknownEndpoint)
//has to be last..
app.use(middleware.errorHandler)
module.exports = app