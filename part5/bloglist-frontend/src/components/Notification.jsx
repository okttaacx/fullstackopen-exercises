import styled from 'styled-components'

const Alert = styled.div`
  color: ${props => props.type === 'error' ? '#721c24' : '#155724'};
  background-color: ${props => props.type === 'error' ? '#f8d7da' : '#d4edda'};
  border: 1px solid ${props => props.type === 'error' ? '#f5c6cb' : '#c3e6cb'};
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
`

const Notification = ({ message, type }) => {
  if (!message) return null

  return (
    <Alert type={type} className={type}>
      {message}
    </Alert>
  )
}

export default Notification