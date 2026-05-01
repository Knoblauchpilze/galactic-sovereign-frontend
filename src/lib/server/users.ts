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

export async function login(_email: string, _password: string): Promise<LoginResult> {
	// TODO: call user-service sessionsCreate and map response
	return { success: false, reason: 'server_error' };
}
