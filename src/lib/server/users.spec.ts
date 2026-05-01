import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sessionsCreateMock, apiConstructorMock } = vi.hoisted(() => ({
	sessionsCreateMock: vi.fn(),
	apiConstructorMock: vi.fn()
}));

vi.mock('$env/static/private', () => ({
	USER_SERVICE_URL: 'http://user-service.test/v1'
}));

vi.mock('$lib/api/user-service/client', () => {
	class Api {
		users = {
			sessionsCreate: sessionsCreateMock
		};

		constructor(config: { baseUrl?: string }) {
			apiConstructorMock(config);
		}
	}

	return { Api };
});

import { login } from './users';

describe('users.login', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('maps a successful envelope to LoginSuccess', async () => {
		sessionsCreateMock.mockResolvedValueOnce({
			data: {
				details: {
					key: 'api-key-1',
					user: 'user-1',
					validUntil: '2026-05-01T12:00:00Z'
				}
			}
		});

		const result = await login('pilot@example.com', 'secret');

		expect(apiConstructorMock).toHaveBeenCalledWith({ baseUrl: 'http://user-service.test/v1' });
		expect(sessionsCreateMock).toHaveBeenCalledWith({
			email: 'pilot@example.com',
			password: 'secret'
		});
		expect(result).toEqual({
			success: true,
			apiKey: 'api-key-1',
			userId: 'user-1',
			validUntil: '2026-05-01T12:00:00Z'
		});
	});

	it('returns server_error when response shape is missing details', async () => {
		sessionsCreateMock.mockResolvedValueOnce({ data: {} });

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'server_error' });
	});

	it('maps thrown 400 HttpResponse-style error to invalid_input', async () => {
		sessionsCreateMock.mockRejectedValueOnce({ status: 400 });

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'invalid_input' });
	});

	it('maps thrown 401 HttpResponse-style error to invalid_credentials', async () => {
		sessionsCreateMock.mockRejectedValueOnce({ status: 401 });

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'invalid_credentials' });
	});

	it('maps thrown 404 HttpResponse-style error to user_not_found', async () => {
		sessionsCreateMock.mockRejectedValueOnce({ status: 404 });

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'user_not_found' });
	});

	it('maps unknown HttpResponse-style status to server_error', async () => {
		sessionsCreateMock.mockRejectedValueOnce({ status: 503 });

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'server_error' });
	});

	it('maps Error message containing 401 to invalid_credentials', async () => {
		sessionsCreateMock.mockRejectedValueOnce(new Error('Request failed with status 401'));

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'invalid_credentials' });
	});

	it('maps unexpected Error to server_error', async () => {
		sessionsCreateMock.mockRejectedValueOnce(new Error('socket hang up'));

		const result = await login('pilot@example.com', 'secret');

		expect(result).toEqual({ success: false, reason: 'server_error' });
	});
});
