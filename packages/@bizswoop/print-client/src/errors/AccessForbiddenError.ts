export default class AccessForbiddenError extends Error {
	kind = 'AccessForbiddenError';
	name = 'AccessForbiddenError';
	constructor(message: string) {
		super(message);
	}
}
