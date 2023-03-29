const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  logger.info('authorization of request is following..')
  logger.info(authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    const what = authorization.replace('Bearer ', '')
    logger.info('extracted token is following..')
    logger.info(what)
    //return authorization.replace('Bearer ', '')
    request.token = what
  }

  next()
}

const userExtractor = async (request, response, next) => {

  const token = request.token
  logger.info('token at user extractor is..', token)
  if (token !== undefined) {
    logger.info('trying to verify the token')
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}