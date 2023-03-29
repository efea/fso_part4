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

/*
 * Important to note that, the populate() function of Mongoose
 * does NOT guarantee transactional operation
 * this means that, state of the database might CHANGE
 * during execution of the populate() function.
 */


/*
 * populate() is chained after the find() operation.
 * the argument given 'blogs' defines that
 *  ids that are references to the blog objects in the blogs field of user
 *  will be populated by the blogs referenced by those ids.
 *
 */
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter

//app.use('/api/users', usersRouter)