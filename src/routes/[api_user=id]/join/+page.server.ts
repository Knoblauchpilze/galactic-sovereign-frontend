import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiUserId = params.api_user;

	return { apiUserId };
};
