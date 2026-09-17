import { test, expect } from '@playwright/test'

test.describe('Combobox', () => {
  test('renders closed with an empty input', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#fruit-combobox-input')).toHaveValue('')
    await expect(page.locator('.combobox__listbox')).toBeHidden()
  })

  test('filters options as the user types', async ({ page }) => {
    await page.goto('/')
    await page.fill('#fruit-combobox-input', 'ap')

    const options = page.locator('.combobox__option')
    await expect(options).toHaveText([
      'Apple',
      'Apricot',
      'Grape',
      'Grapefruit',
      'Papaya',
      'Pineapple',
    ])
  })

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.goto('/')
    await page.fill('#fruit-combobox-input', 'zzz')

    await expect(page.locator('.combobox__empty')).toHaveText('No results')
    await expect(page.locator('.combobox__listbox')).toBeHidden()
  })

  test('selects an option on click and closes the listbox', async ({ page }) => {
    await page.goto('/')
    await page.fill('#fruit-combobox-input', 'ap')
    await page.click('.combobox__option >> text=Apricot')

    await expect(page.locator('#fruit-combobox-input')).toHaveValue('Apricot')
    await expect(page.locator('.combobox__listbox')).toBeHidden()
  })
})
