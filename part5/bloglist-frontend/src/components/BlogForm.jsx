import { useState } from 'react'
import styled from 'styled-components'

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`

const FormGroup = styled.div`
  margin-bottom: 15px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const SubmitButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #0b7dda;
  }
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <FormContainer>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input value={title} placeholder="title" onChange={e => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Author</Label>
          <Input value={author} placeholder="author" onChange={e => setAuthor(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>URL</Label>
          <Input value={url} placeholder="url" onChange={e => setUrl(e.target.value)} />
        </FormGroup>
        <SubmitButton type="submit">Create</SubmitButton>
      </form>
    </FormContainer>
  )
}

export default BlogForm