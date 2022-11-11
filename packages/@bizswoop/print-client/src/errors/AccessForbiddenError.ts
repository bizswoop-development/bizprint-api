export const AccessForbiddenErrorCode = 'ERR_ACCESS_FORBIDDEN';

export default class AccessForbiddenError extends Error {
	kind = 'AccessForbiddenError';
	name = 'AccessForbiddenError';

	constructor(message: string) {
		super(message);
	}
}
