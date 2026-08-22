import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/server/users';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const userId = formData.get('userId') as string | null;

	if (userId) {
		await logout(userId);
	}

	redirect(303, '/');
};
