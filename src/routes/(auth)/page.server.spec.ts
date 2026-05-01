import type { ActionFailure, RequestEvent } from '@sveltejs/kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actions } from './+page.server';
import type { LoginResult } from '$lib/server/users';

vi.mock('$lib/server/users', () => ({
	login: vi.fn()
}));

import { login } from '$lib/server/users';

const mockLogin = vi.mocked(login);

type FailureReason = 'invalid_credentials' | 'user_not_found' | 'invalid_input' | 'server_error';
type FailureData = { reason: FailureReason };

const createRequestEvent = (
	email: string,
	password: string
): RequestEvent<Record<string, never>, '/(auth)'> => {
	const formData = new FormData();
	formData.append('email', email);
	formData.append('password', password);

	const request = new Request('http://localhost/(auth)?/login', {
		method: 'POST',
		body: formData
	});

	type EventTracing = RequestEvent<Record<string, never>, '/(auth)'>['tracing'];
	const tracing: EventTracing = {
		enabled: false,
		root: {} as unknown as EventTracing['root'],
		current: {} as unknown as EventTracing['current']
	};

	const event = {
		cookies: {
			get: () => undefined,
			getAll: () => [],
			set: () => undefined,
			delete: () => undefined,
			serialize: () => ''
		},
		fetch,
		getClientAddress: () => '127.0.0.1',
		locals: {},
		params: {},
		platform: undefined,
		request,
		route: { id: '/(auth)' as const },
		setHeaders: () => undefined,
		url: new URL('http://localhost/(auth)'),
		isDataRequest: false,
		isSubRequest: false,
		tracing,
		isRemoteRequest: false
	} satisfies RequestEvent<Record<string, never>, '/(auth)'>;

	return event;
};

const assertFailure = (value: unknown): ActionFailure<FailureData> => {
	if (typeof value === 'object' && value !== null && 'status' in value && 'data' in value) {
		return value as ActionFailure<FailureData>;
	}
	throw new Error('Expected ActionFailure result');
};

describe('(auth) page action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls login with email and password from form data', async () => {
		const successResult: LoginResult = {
			success: true,
			apiKey: 'test-key-123',
			userId: 'user-456',
			validUntil: '2026-05-02T12:00:00Z'
		};
		mockLogin.mockResolvedValueOnce(successResult);

		const event = createRequestEvent('test@example.com', 'password123');
		const result = await actions.default(event);

		expect(mockLogin).toHaveBeenCalledOnce();
		expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
		expect(result).toEqual({ success: true });
	});

	it('returns 401 status with invalid_credentials reason', async () => {
		mockLogin.mockResolvedValueOnce({
			success: false,
			reason: 'invalid_credentials'
		});

		const event = createRequestEvent('test@example.com', 'wrongpassword');
		const result = await actions.default(event);

		const failure = assertFailure(result);
		expect(failure.status).toBe(401);
		expect(failure.data).toEqual({ reason: 'invalid_credentials' });
	});

	it('returns 401 status with user_not_found reason', async () => {
		mockLogin.mockResolvedValueOnce({
			success: false,
			reason: 'user_not_found'
		});

		const event = createRequestEvent('nonexistent@example.com', 'password');
		const result = await actions.default(event);

		const failure = assertFailure(result);
		expect(failure.status).toBe(401);
		expect(failure.data).toEqual({ reason: 'user_not_found' });
	});

	it('returns 400 status with invalid_input reason', async () => {
		mockLogin.mockResolvedValueOnce({
			success: false,
			reason: 'invalid_input'
		});

		const event = createRequestEvent('invalid-email', 'pass');
		const result = await actions.default(event);

		const failure = assertFailure(result);
		expect(failure.status).toBe(400);
		expect(failure.data).toEqual({ reason: 'invalid_input' });
	});

	it('returns 500 status with server_error reason', async () => {
		mockLogin.mockResolvedValueOnce({
			success: false,
			reason: 'server_error'
		});

		const event = createRequestEvent('test@example.com', 'password');
		const result = await actions.default(event);

		const failure = assertFailure(result);
		expect(failure.status).toBe(500);
		expect(failure.data).toEqual({ reason: 'server_error' });
	});
});
