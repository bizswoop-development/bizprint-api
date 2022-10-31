export abstract class InvalidRequestError<T> extends Error {
	kind = 'InvalidRequestError';
	errors: InvalidRequestErrorsInfo<T>;
	constructor(message: string, errors) {
		super(message);
		this.errors = errors as InvalidRequestErrorsInfo<T>;
	}
}

export type InvalidRequestErrorsInfo<T = string> = {
	[key in keyof T]?: string[];
};
