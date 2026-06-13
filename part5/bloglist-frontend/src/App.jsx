import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import BlogView from './components/BlogView'

const Page = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
`

const Navigation = styled.nav`
  background-color: #333;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: #4CAF50;
  }
`

const UserInfo = styled.div`
  color: #ddd;
  margin-left: auto;
  font-size: 0.9em;
`

const LogoutButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const BlogListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: '' })
  
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  
  const blog = match 
    ? blogs.find(b => b.id === match.params.id) 
    : null

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notify(`Welcome back, ${user.name}`)
      navigate('/')
    } catch (exception) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/login')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      navigate('/')
    } catch (exception) {
      notify('error adding blog', 'error')
    }
  }

  const updateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate.id, {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate.user.id
      })
      setBlogs(blogs.map(b => b.id !== blogToUpdate.id ? b : updatedBlog))
    } catch (exception) {
      notify('error updating blog', 'error')
    }
  }

  const removeBlog = async (blogToRemove) => {
    try {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
      notify(`Blog ${blogToRemove.title} removed`)
      navigate('/')
    } catch (exception) {
      notify('error removing blog', 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (!user) {
    return (
      <Container>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm handleLogin={handleLogin} />
      </Container>
    )
  }

  return (
    <Page>
      <Navigation>
        <StyledLink to="/">blogs</StyledLink>
        <StyledLink to="/create">create new</StyledLink>
        <UserInfo>
          {user.name} logged in 
          <LogoutButton onClick={handleLogout}>logout</LogoutButton>
        </UserInfo>
      </Navigation>

      <Container>
        <h2>Blog App</h2>
        <Notification message={notification.message} type={notification.type} />

        <Routes>
          <Route path="/" element={
            <BlogListContainer>
              {sortedBlogs.map(blog => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </BlogListContainer>
          } />
          
          <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
          
          <Route path="/blogs/:id" element={
            <BlogView 
              blog={blog} 
              updateBlog={updateBlog} 
              removeBlog={removeBlog} 
              currentUser={user} 
            />
          } />
        </Routes>
      </Container>
    </Page>
  )
}

export default App