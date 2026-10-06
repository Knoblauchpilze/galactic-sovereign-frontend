import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	USER_SERVICE_URL: {
		public: false,
		static: true
	},
	GAME_SERVICE_URL: {
		public: false,
		static: true
	}
});
