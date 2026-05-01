import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { writable, type Writable } from 'svelte/store';

type PageForm = {
	reason?: 'invalid_credentials' | 'user_not_found' | 'invalid_input' | 'server_error' | string;
};

type MockPageState = {
	form?: PageForm;
};

let mockPageStore: Writable<MockPageState>;

vi.mock('$app/stores', () => {
	mockPageStore = writable({ form: undefined });
	return {
		page: mockPageStore
	};
});

import LoginPage from './+page.svelte';

describe('login form contract', () => {
	beforeEach(() => {
		mockPageStore.set({ form: undefined });
	});

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

	it('shows mapped error message for invalid_credentials reason', async () => {
		mockPageStore.set({ form: { reason: 'invalid_credentials' } });
		render(LoginPage);

		await expect.element(page.getByText('Invalid email or password')).toBeInTheDocument();
	});

	it('shows mapped error message for invalid_input reason', async () => {
		mockPageStore.set({ form: { reason: 'invalid_input' } });
		render(LoginPage);

		await expect
			.element(page.getByText('Please check your email and password'))
			.toBeInTheDocument();
	});

	it('shows fallback message for unknown reason', async () => {
		mockPageStore.set({ form: { reason: 'something_else' } });
		render(LoginPage);

		await expect.element(page.getByText('An error occurred')).toBeInTheDocument();
	});
});
