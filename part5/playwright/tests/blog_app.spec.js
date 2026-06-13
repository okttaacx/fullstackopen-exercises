const loginWith = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'create new' }).click()
  await page.getByPlaceholder('title').fill(blog.title)
  await page.getByPlaceholder('author').fill(blog.author)
  await page.getByPlaceholder('url').fill(blog.url)
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByRole('link', { name: `${blog.title} - ${blog.author}` }).waitFor()
}

export { loginWith, createBlog }