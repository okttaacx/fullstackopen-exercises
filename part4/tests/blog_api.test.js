const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let token = ''

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    
    token = loginResponse.body.token

    const userInDb = await User.findOne({ username: 'root' })
    const userId = userInDb._id.toString()

    const initialBlogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: userId
    }))

    await Blog.insertMany(initialBlogsWithUser)
  })

  test('blogs are returned as json and correct amount', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const idExists = response.body.every(blog => 'id' in blog && !('_id' in blog))
    assert.strictEqual(idExists, true)
  })

  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Async/await makes testing easy',
      author: 'Okta',
      url: 'https://fullstackopen.com/',
      likes: 42
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Async/await makes testing easy'))
  })

  test('fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Okta',
      url: 'https://notoken.com/'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Okta',
      url: 'https://nolikes.com/'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('if title or url are missing, backend responds with 400 Bad Request', async () => {
    const blogWithoutTitle = {
      author: 'No Title',
      url: 'https://notitle.com/'
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutTitle).expect(400)

    const blogWithoutUrl = {
      title: 'No URL',
      author: 'No URL'
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutUrl).expect(400)
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating the likes of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 10 
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})