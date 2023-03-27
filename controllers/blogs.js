const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')

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
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  logger.info('adding a blog..')
  const body = request.body
  //logger.info('request body is..', body)
  const user = await User.findById(body.id)
  //const blog = new Blog(request.body)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const saved = await blog.save()
  user.blogs = user.blogs.concat(saved._id)
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