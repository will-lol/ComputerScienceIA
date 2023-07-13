import { test, expect } from '@playwright/test';

test('github auth', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByRole('link', { name: 'Login with GitHub' }).click();
	page.getByText('Sign in to GitHub to continue to iPod Statistics');
});

test('statistics', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	const fileChooserPromise = page.waitForEvent('filechooser');
	await page.getByRole('button', { name: "I've saved the file!" }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles('tests/test.xml');
	await page.waitForURL('**/results');
});
