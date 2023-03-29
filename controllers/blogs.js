const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  //logger.info('authorization of request is following..')
  //logger.info(authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    //const what = authorization.replace('Bearer ', '')
    //logger.info('extracted token is following..')
    //logger.info(what)
    return authorization.replace('Bearer ', '')
  }
  return null
}
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
  //const blogs = await Blog.find({}).populate('user','64222cd40e3f31e321e8d55e')
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  logger.info('adding a blog..')
  const body = request.body
  logger.info('body.userId is: ', body.userId)
  const tokentoprint = getTokenFrom(request)
  logger.info('token from request is following..')
  logger.info(tokentoprint)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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