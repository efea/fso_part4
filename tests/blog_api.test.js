const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
//const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.sixBlogs)
})

/*
 * supertest internally makes the server listen to ports
 * we need not worry about it
 */


test('blogs are returned as json..', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are six blogs..', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.sixBlogs.length)
}, 100000)



afterAll(async () => {
  await mongoose.connection.close()
})