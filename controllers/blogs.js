const blogsRouter = require('express').Router()
//const middleware = require('../utils/middleware.js')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')

/*
 * notice how try/catch blocks are not used in this code
 * even though it can result in not handled exceptions.
 *
 * This is OK in this case, because we use
 * express-async-errors package.. (see app.js)
 *
 * which passes the execution of the code to error handling
 * middleware somehow, when some exception occurs..
*/

blogsRouter.get('/', async (request, response) => {
  logger.info('getting blogs..')
  const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1, id: 1 })
  //const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  logger.info('adding a blog..')

  const body = request.body
  logger.info('body.userId is: ', body.userId)
  const user = request.user
  //const tokentoprint = request.token
  //logger.info('token from request is following..')
  //logger.info(tokentoprint)

  //const decodedToken = jwt.verify(tokentoprint, process.env.SECRET)
  if (!user) {
    return response.status(401).json({ error: 'can not add the blog, no user found in userExtract' })
  }
  //const user = await User.findById(decodedToken.id)
  //const user = request.user
  //const oneuser = await User.findOne({})
  //const oneuserid = oneuser.id
  //logger.info('one userid is following..')
  //logger.info(oneuserid)

  //const finalUserId = body.userId === undefined
  //  ? oneuserid: body.userId


  //const user = await User.findById(finalUserId)
  //logger.info('user found from is following..')
  //logger.info(user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  const saved = await blog.save()

  /*
   * Note that we are also changing the user.
   * the blogs property of the user is concatanated with the new blog id..
   * then saved to the DB..
   */
  user.blogs = user.blogs.concat(saved._id)
  await user.save()

  response.status(201).json(saved.toJSON)
})

blogsRouter.delete('/:id', async (request, response) => {
  //await Blog.findByIdAndRemove(request.params.id)
  //response.status(204).end()
  const token = request.token
  const user = request.user
  if(token === undefined){
    return response.status(401).json({ error: 'no token found in the request' })
  }
  //const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!user) {
    logger.info('do we come here actually or do we throw error from jwt.verify??')
    return response.status(401).json({ error: 'no user associated with this token' })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(blog.id)
    response.sendStatus(204)
  }
  else{
    response.status(401).json({ error:'unable to delete blog. user from token does not match.' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const uptodate = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(uptodate.toJSON)
})

module.exports = blogsRouter