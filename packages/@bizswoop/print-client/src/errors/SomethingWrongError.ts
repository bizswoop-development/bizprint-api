export const SomethingWrongErrorCode = 'ERR_SOMETHING_WRONG';

export default class SomethingWrongError extends Error {
	kind = 'SomethingWrongError';
	name = 'SomethingWrongError';

	constructor(message: string) {
		super(message);
	}
}
