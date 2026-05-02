import { test, expect } from '@playwright/test'

test.describe('site structure', () => {
  test('home page has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/hraju\.dev/)
  })

  test('home page renders the site header', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: 'hraju.dev' })).toBeVisible()
  })

  test('header has About link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
  })

  test('header has RSS link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'RSS' })).toBeVisible()
  })

  test('about page loads with correct heading', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/About/)
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
  })

  test('about page is reachable from the header', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
  })

  test('logo link returns to home from about', async ({ page }) => {
    await page.goto('/about')
    await page.getByRole('link', { name: 'hraju.dev' }).click()
    await expect(page).toHaveURL('/')
  })

  test('unknown route returns 404 page', async ({ page }) => {
    const response = await page.goto('/does-not-exist-xyz')
    expect(response?.status()).toBe(404)
  })
})

test.describe('feeds and crawlability', () => {
  test('feed.xml returns RSS content-type', async ({ request }) => {
    const response = await request.get('/feed.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('rss+xml')
  })

  test('feed.xml contains RSS root element', async ({ request }) => {
    const response = await request.get('/feed.xml')
    const text = await response.text()
    expect(text).toContain('<rss')
    expect(text).toContain('<channel>')
  })

  test('sitemap.xml returns 200', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
  })

  test('robots.txt allows / and disallows /admin/', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('Allow: /')
    expect(text).toContain('Disallow: /admin/')
  })

  test('llms.txt returns plain text with site heading', async ({ request }) => {
    const response = await request.get('/llms.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    const text = await response.text()
    expect(text).toContain('# hraju.dev')
  })

  test('llms-full.txt returns plain text with full content header', async ({ request }) => {
    const response = await request.get('/llms-full.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    const text = await response.text()
    expect(text).toContain('hraju.dev')
  })
})

test.describe('post page', () => {
  test('non-numeric post id returns 404', async ({ page }) => {
    const response = await page.goto('/posts/not-a-number')
    expect(response?.status()).toBe(404)
  })

  test('non-existent post id returns 404', async ({ page }) => {
    const response = await page.goto('/posts/999999999')
    expect(response?.status()).toBe(404)
  })
})
