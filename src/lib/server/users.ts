import { USER_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/user-service/client';
import type { CommunicationUserDtoRequest } from '$lib/api/user-service/client';

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
		const client = new Api({ baseUrl: USER_SERVICE_URL });
		const data: CommunicationUserDtoRequest = { email, password };

		const response = await client.users.sessionsCreate(data);

		if (response && response.data && response.data.details) {
			return {
				success: true,
				apiKey: response.data.details.key,
				userId: response.data.details.user,
				validUntil: response.data.details.validUntil
			};
		}

		return { success: false, reason: 'server_error' };
	} catch (error) {
		// The generated client throws HttpResponse objects for non-2xx responses
		// These are not Error instances, so we need to check their structure
		const httpResponse = error as { status?: number; error?: { details?: string } };

		// Map HTTP status codes to LoginFailure reasons
		switch (httpResponse.status) {
			case 400:
				return { success: false, reason: 'invalid_input' };
			case 401:
				return { success: false, reason: 'invalid_credentials' };
			case 404:
				return { success: false, reason: 'user_not_found' };
		}

		// If it's an actual Error instance, check the message
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			if (message.includes('400')) return { success: false, reason: 'invalid_input' };
			if (message.includes('401')) return { success: false, reason: 'invalid_credentials' };
			if (message.includes('404')) return { success: false, reason: 'user_not_found' };
		}

		// Default to server error for any other case
		return { success: false, reason: 'server_error' };
	}
}
