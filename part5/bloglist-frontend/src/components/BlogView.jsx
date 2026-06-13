import styled from 'styled-components'

const ViewContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`

const LinkText = styled.a`
  color: #007bff;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

const InfoRow = styled.div`
  margin: 10px 0;
  font-size: 1.1em;
`

const Button = styled.button`
  background-color: ${props => props.danger ? '#f44336' : '#4CAF50'};
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: ${props => props.danger ? '0' : '10px'};
  margin-top: ${props => props.danger ? '20px' : '0'};

  &:hover {
    background-color: ${props => props.danger ? '#d32f2f' : '#45a049'};
  }
`

const BlogView = ({ blog, updateBlog, removeBlog, currentUser }) => {
  if (!blog) return null

  const handleLike = () => {
    updateBlog(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const showRemoveButton = currentUser && blog.user && currentUser.username === blog.user.username

  return (
    <ViewContainer className="blog-details">
      <Title>{blog.title} {blog.author}</Title>
      <InfoRow>
        <LinkText href={blog.url} target="_blank" rel="noreferrer">{blog.url}</LinkText>
      </InfoRow>
      <InfoRow>
        {blog.likes} likes 
        <Button onClick={handleLike}>like</Button>
      </InfoRow>
      <InfoRow>
        added by {blog.user ? blog.user.name : 'unknown'}
      </InfoRow>
      
      {showRemoveButton && (
        <Button danger onClick={handleRemove}>remove</Button>
      )}
    </ViewContainer>
  )
}

export default BlogView