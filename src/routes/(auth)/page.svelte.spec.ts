import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LoginPage from './+page.svelte';

describe('login form contract', () => {
	it('has a required email input with expected attributes', async () => {
		render(LoginPage);

		const emailInput = page.getByLabelText('Email');
		await expect.element(emailInput).toBeInTheDocument();
		await expect.element(emailInput).toHaveAttribute('name', 'email');
		await expect.element(emailInput).toHaveAttribute('required', '');
	});

	it('has a required password input with password type and expected name', async () => {
		render(LoginPage);

		const passwordInput = page.getByLabelText('Password');
		await expect.element(passwordInput).toBeInTheDocument();
		await expect.element(passwordInput).toHaveAttribute('name', 'password');
		await expect.element(passwordInput).toHaveAttribute('type', 'password');
		await expect.element(passwordInput).toHaveAttribute('required', '');
	});

	it('has a submit button', async () => {
		render(LoginPage);

		await expect
			.element(page.getByRole('button', { name: 'Login' }))
			.toHaveAttribute('type', 'submit');
	});

	it('uses POST method on the form', async () => {
		const { container } = render(LoginPage);
		const form = container.querySelector('form');

		expect(form).not.toBeNull();
		if (form) {
			await expect.element(page.elementLocator(form)).toHaveAttribute('method', 'POST');
		}
	});
});
