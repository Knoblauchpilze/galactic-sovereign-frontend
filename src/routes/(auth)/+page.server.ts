import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		console.log('Login attempt received:', { email, password });

		// TODO: Implement actual authentication logic

		return { success: true };
	}
};
