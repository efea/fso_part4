const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')
const api = supertest(app)

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

  await User.deleteMany({})

  //generate hash
  const passwordHash = await bcrypt.hash('sekret', 10)
  //save new user and hash
  const newUser = await new User({ username: 'efea', passwordHash }).save()

  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  const test = {
    title: 'kivinaz cok yumo',
    author: 'efeas',
    url: 'www.c11.com',
    likes: 4
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(test)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.sixBlogs.length + 1)
}, 100000)

test('default value for likes property is 0..', async () => {

  await User.deleteMany({})

  //generate hash
  const passwordHash = await bcrypt.hash('sekret', 10)
  //save new user and hash
  const newUser = await new User({ username: 'efea', passwordHash }).save()

  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  const test = {
    title: 'sen kivisin',
    author: 'efe',
    url: 'https://www.c7.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(test)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.sixBlogs.length + 1)
  expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('responds with 400 if title or url are missing.. ', async () => {

  await User.deleteMany({})

  //generate hash
  const passwordHash = await bcrypt.hash('sekret', 10)
  //save new user and hash
  const newUser = await new User({ username: 'efea', passwordHash }).save()

  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  const test = {
    author: 'efe',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(test)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.sixBlogs.length)
})

test('deleting with an id.. ', async () => {

  await User.deleteMany({})

  //generate hash
  const passwordHash = await bcrypt.hash('sekret', 10)
  //save new user and hash
  const newUser = await new User({ username: 'efea', passwordHash }).save()

  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  const test = {
    title: 'sen kivisin',
    author: 'efe',
    url: 'https://www.c7.com',
  }

  //add a blog so we can remove it..
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(test)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const initial = await helper.getAllBlogsFromDb()
  expect(initial).toHaveLength(helper.sixBlogs.length + 1)

  //target to delete will be the last addition to the blogs..
  const target = initial[helper.sixBlogs.length].id

  await api
    .delete(`/api/blogs/${target}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const post = await helper.getAllBlogsFromDb()
  expect(post).toHaveLength(helper.sixBlogs.length)
})

test('updating a blog using its id..', async () => {
  await User.deleteMany({})

  //generate hash
  const passwordHash = await bcrypt.hash('sekret', 10)
  //save new user and hash
  const newUser = await new User({ username: 'efea', passwordHash }).save()

  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  const test = {
    title: 'sen kivisin',
    author: 'efe',
    url: 'https://www.c7.com',
  }

  //add a blog so we can update it..
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(test)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const initial = await helper.getAllBlogsFromDb()
  expect(initial).toHaveLength(helper.sixBlogs.length + 1)
  const target = initial[helper.sixBlogs.length].id

  await api
    .put(`/api/blogs/${target}`)
    .set('Authorization', `Bearer ${token}`)
    .send(
      {
        'title': 'kivi naz',
        'author': 'efea',
        'url': 'www.c11.com',
        'likes': 5
      }
    )
    .expect(200)

  const post = await helper.getAllBlogsFromDb()
  //expecting +1 since we added the one we wanted to update..
  expect(post).toHaveLength(helper.sixBlogs.length + 1)
  expect(post[helper.sixBlogs.length].title).toEqual('kivi naz')
})

test('gets 401 if there is no token', async () => {

  const test = {
    title: 'sen kivisin',
    author: 'efe',
    url: 'https://www.c7.com',
  }

  const initial = await helper.getAllBlogsFromDb()
  expect(initial).toHaveLength(helper.sixBlogs.length)

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer')
    .send(test)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const post = await helper.getAllBlogsFromDb()
  expect(post).toHaveLength(helper.sixBlogs.length)


})


afterAll(async () => {
  await mongoose.connection.close()
})
