import { defineParams } from '@sveltejs/kit/params';

// https://kit.svelte.dev/docs/advanced-routing#matching
export const params = defineParams({
	id: (param) => {
		// https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
		const UUID_REGEX =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return UUID_REGEX.test(param) ? param : undefined;
	}
});
