const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill(blog.title)
  await page.getByPlaceholder('author').fill(blog.author)
  await page.getByPlaceholder('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('.blog-title-author').filter({ hasText: blog.title }).waitFor()
}

export { loginWith, createBlog }