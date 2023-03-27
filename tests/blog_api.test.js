const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
describe('api testing..', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.sixBlogs)
  }, 100000)

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

  test('UID is named id..', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(element => {
      expect(element.id).toBeDefined()
    })
  }, 100000)

  test('a blog can be inserted to the db..', async () => {

    const test = {
      title: 'kivinaz cok yumo',
      author: 'efeas',
      url: 'www.c11.com',
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(test)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.sixBlogs.length + 1)
  }, 100000)

  test('default value for likes property is 0..', async () => {
    const test = {
      title: 'sen kivisin',
      author: 'efe',
      url: 'https://www.c7.com',
    }

    await api
      .post('/api/blogs')
      .send(test)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.sixBlogs.length + 1)
    expect(response.body[response.body.length - 1].likes).toBe(0)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

})