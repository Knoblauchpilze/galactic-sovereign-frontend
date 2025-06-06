import { fail, redirect } from '@sveltejs/kit';
import { resetAllCookies, setSessionCookies } from '$lib/cookies';
import { loginUser } from '$lib/services/sessions';
import { ApiKeyResponseDto } from '$lib/communication/api/apiKeyResponseDto';
import {
	getHttpStatusCodeFromApiFailure,
	HttpStatus,
	parseApiResponseAsSingleValue,
	tryGetFailureReason
} from '@totocorpsoftwareinc/frontend-toolkit';
import { getErrorMessageFromApiResponse } from '$lib/rest/api';

export async function load({ cookies }) {
	resetAllCookies(cookies);
}

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');
		if (!email) {
			// https://svelte.dev/docs/kit/form-actions
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the email',
				email: email
			});
		}
		if (!password) {
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the password',
				email: email
			});
		}

		const apiResponse = await loginUser(email as string, password as string);
		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);
			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),
				email: email
			});
		}

		const apiKeyDto = parseApiResponseAsSingleValue(apiResponse, ApiKeyResponseDto);
		if (apiKeyDto !== undefined) {
			setSessionCookies(cookies, apiKeyDto);
		} else {
			fail(HttpStatus.INTERNAL_SERVER_ERROR, {
				message: 'Failed to get login data',
				email: email
			});
		}

		redirect(HttpStatus.SEE_OTHER, '/lobby');
	}
};
