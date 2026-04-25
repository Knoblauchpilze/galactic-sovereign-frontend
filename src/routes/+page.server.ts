import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		console.log('Login attempt received:', { username, password });

		// TODO: Implement actual authentication logic

		return { success: true };
	}
};
