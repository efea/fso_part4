const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

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
  const blog = new Blog(request.body)
  const saved = await blog.save()
  response.status(201).json(saved.toJSON)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
module.exports = blogsRouter