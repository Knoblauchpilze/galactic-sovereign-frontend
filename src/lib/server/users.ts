import { USER_SERVICE_URL } from '$env/static/private';
import { Users } from '$lib/api/user-service/Users';
import type { CommunicationUserDtoRequest } from '$lib/api/user-service/data-contracts';

export type LoginSuccess = {
	success: true;
	apiKey: string;
	userId: string;
	validUntil: string;
};

export type LoginFailure = {
	success: false;
	reason: 'invalid_credentials' | 'user_not_found' | 'invalid_input' | 'server_error';
};

export type LoginResult = LoginSuccess | LoginFailure;

export async function login(email: string, password: string): Promise<LoginResult> {
	try {
		console.log('[login] Starting login attempt for:', email);
		console.log('[login] USER_SERVICE_URL:', USER_SERVICE_URL);

		const client = new Users({ baseUrl: USER_SERVICE_URL });
		const data: CommunicationUserDtoRequest = { email, password };

		console.log('[login] Calling sessionsCreate with client baseUrl:', client.baseUrl);

		// Call the generated client's sessionsCreate method
		// This returns HttpResponse<RestResponseEnvelopeCommunicationApiKeyDtoResponse, ...>
		// where response.data contains the envelope, and response.data.details contains the API key
		const response = await client.sessionsCreate(data);

		console.log('[login] Response received:', JSON.stringify(response, null, 2));

		// Extract the API key details from the response envelope
		if (response && response.data && response.data.details) {
			console.log('[login] Login successful');
			return {
				success: true,
				apiKey: response.data.details.key,
				userId: response.data.details.user,
				validUntil: response.data.details.validUntil
			};
		}

		// If response structure is unexpected
		console.log('[login] Response structure unexpected:', response);
		return { success: false, reason: 'server_error' };
	} catch (error) {
		// Handle network errors, timeouts, and API errors
		// Map HTTP status codes and error responses to LoginFailure reasons
		console.error('[login] Error caught:', error);

		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			console.error('[login] Error message:', message);

			// Check for specific error patterns in the error message
			if (message.includes('400') || message.includes('invalid_input')) {
				return { success: false, reason: 'invalid_input' };
			}
			if (message.includes('401') || message.includes('invalid_credentials')) {
				return { success: false, reason: 'invalid_credentials' };
			}
			if (message.includes('404') || message.includes('not_found')) {
				return { success: false, reason: 'user_not_found' };
			}
		}

		// Default to server error for any other case (network error, timeout, 5xx, etc.)
		return { success: false, reason: 'server_error' };
	}
}
