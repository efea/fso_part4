const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  logger.info('trying to add a user..')

  if(!username || !password){
    return response.status(400).json({
      error: 'no password or username..'
    })
  }
  if(username.length < 3 || password.length < 3){
    return response.status(400).json({
      error: 'password and username must be at least 3 characters long'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter

//app.use('/api/users', usersRouter)