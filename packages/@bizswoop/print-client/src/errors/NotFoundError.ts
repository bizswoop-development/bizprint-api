export const NotFoundErrorCode = 'ERR_NOT_FOUND';

export default class NotFoundError extends Error {
	kind = 'NotFoundError';
	name = 'NotFoundError';

	constructor(message: string) {
		super(message);
	}
}
