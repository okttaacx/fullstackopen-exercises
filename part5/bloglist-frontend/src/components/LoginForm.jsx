import { useState } from 'react'
import styled from 'styled-components'

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-width: 400px;
  margin: 40px auto;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
`

const SubmitButton = styled.button`
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <FormContainer>
      <Title>Log in to application</Title>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label>
            Username
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>
            Password
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Label>
        </FormGroup>
        <SubmitButton type="submit">Login</SubmitButton>
      </form>
    </FormContainer>
  )
}

export default LoginForm