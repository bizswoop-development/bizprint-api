export default class UnauthorizedError extends Error {
	kind = 'UnauthorizedError';
	name = 'UnauthorizedError';
	constructor(message: string) {
		super(message);
	}
}
