import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com',
    likes: 5,
    user: {
      username: 'tester',
      name: 'Test User'
    }
  }

  const user = {
    username: 'tester',
    name: 'Test User'
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} user={user} updateBlog={() => {}} removeBlog={() => {}} />)

    expect(screen.getByText(/Component testing is done with react-testing-library/)).toBeDefined()
    expect(screen.getByText(/Kent C. Dodds/)).toBeDefined()

    expect(screen.queryByText('https://testing-library.com')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()
  })

  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} user={user} updateBlog={() => {}} removeBlog={() => {}} />)

    const userEventSetup = userEvent.setup()
    const button = screen.getByText('view')
    await userEventSetup.click(button)

    expect(screen.getByText('https://testing-library.com')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
  })

  test('clicking like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={user} updateBlog={mockHandler} removeBlog={() => {}} />)

    const userEventSetup = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userEventSetup.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEventSetup.click(likeButton)
    await userEventSetup.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})