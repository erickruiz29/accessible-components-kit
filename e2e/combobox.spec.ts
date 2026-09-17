import { test, expect } from '@playwright/test'

test.describe('Combobox', () => {
  test('renders closed with an empty input', async ({ page }) => {
    await page.goto('/')
    const input = page.getByRole('combobox', { name: 'Favorite fruit' })

    await expect(input).toHaveValue('')
    await expect(page.getByRole('listbox')).toBeHidden()
  })

  test('filters options as the user types', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Favorite fruit' }).fill('ap')

    const options = page.getByRole('option')
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
    await page.getByRole('combobox', { name: 'Favorite fruit' }).fill('zzz')

    await expect(page.locator('.combobox__empty')).toHaveText('No results')
    await expect(page.getByRole('listbox')).toBeHidden()
  })

  test('selects an option on click and closes the listbox', async ({ page }) => {
    await page.goto('/')
    const input = page.getByRole('combobox', { name: 'Favorite fruit' })
    await input.fill('ap')
    await page.getByRole('option', { name: 'Apricot' }).click()

    await expect(input).toHaveValue('Apricot')
    await expect(page.getByRole('listbox')).toBeHidden()
  })

  test('announces the result count via a live region', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Favorite fruit' }).fill('ap')

    await expect(page.getByRole('status')).toHaveText('6 results available')
  })

  test('supports arrow-key navigation and Enter to select', async ({ page }) => {
    await page.goto('/')
    const input = page.getByRole('combobox', { name: 'Favorite fruit' })
    await input.fill('ap')

    await input.press('ArrowDown')
    await input.press('ArrowDown')
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      await page.getByRole('option', { name: 'Apricot' }).getAttribute('id') ?? '',
    )

    await input.press('Enter')
    await expect(input).toHaveValue('Apricot')
    await expect(page.getByRole('listbox')).toBeHidden()
  })

  test('closes the listbox on Escape without changing the value', async ({ page }) => {
    await page.goto('/')
    const input = page.getByRole('combobox', { name: 'Favorite fruit' })
    await input.fill('ap')
    await input.press('Escape')

    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(input).toHaveValue('ap')
  })
})
