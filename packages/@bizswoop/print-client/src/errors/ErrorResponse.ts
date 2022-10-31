import { InvalidRequestErrorsInfo } from '@/errors/InvalidRequestError';

export type ErrorResponse =
	| InvalidRequestErrorResponse
	| AccessForbiddenErrorResponse
	| UnauthorizedErrorResponse;

interface BaseErrorResponse {
	errorCode: string;
	message: string;
}

interface InvalidRequestErrorResponse extends BaseErrorResponse {
	errorCode: 'ERR_INVALID_REQUEST';
	errors: InvalidRequestErrorsInfo;
}

interface AccessForbiddenErrorResponse extends BaseErrorResponse {
	errorCode: 'ERR_ACCESS_FORBIDDEN';
}

interface UnauthorizedErrorResponse extends BaseErrorResponse {
	errorCode: 'ERR_UNAUTHORIZED';
}
