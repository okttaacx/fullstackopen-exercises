import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BlogCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 1.1em;
  font-weight: 500;

  &:hover {
    color: #4CAF50;
  }
`

const Blog = ({ blog }) => {
  return (
    <BlogCard className="blog">
      <StyledLink to={`/blogs/${blog.id}`}>
        {blog.title} - {blog.author}
      </StyledLink>
    </BlogCard>
  )
}

export default Blog