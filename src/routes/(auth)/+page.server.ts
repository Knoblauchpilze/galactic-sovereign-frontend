import { fail } from '@sveltejs/kit';
import { login } from '$lib/server/users';
import { getPlayersByApiUser } from '$lib/server/players';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const result = await login(email, password);

		if (!result.success) {
			const statusByReason: Record<typeof result.reason, number> = {
				invalid_input: 400,
				invalid_credentials: 401,
				user_not_found: 401,
				server_error: 500
			};
			return fail(statusByReason[result.reason], { reason: result.reason });
		}

		const players = await getPlayersByApiUser(result.userId);
		console.log(players);

		return { success: true };
	}
};
