import { JobCreatingErrorResponse } from '@/resources/Jobs/errors/JobCreatingErrorResponse';

import { AccessForbiddenErrorCode } from '@/errors/AccessForbiddenError';
import { InvalidRequestErrorCode, InvalidRequestErrorsInfo } from '@/errors/InvalidRequestError';
import { NotFoundErrorCode } from '@/errors/NotFoundError';
import { SomethingWrongErrorCode } from '@/errors/SomethingWrongError';
import { UnauthorizedErrorCode } from '@/errors/UnauthorizedError';

export type ErrorResponse =
	| InvalidRequestErrorResponse
	| AccessForbiddenErrorResponse
	| UnauthorizedErrorResponse
	| JobCreatingErrorResponse
	| SomethingWrongErrorResponse
	| NotFoundErrorResponse;

export interface BaseErrorResponse {
	errorCode: string;
	message: string;
}

interface InvalidRequestErrorResponse extends BaseErrorResponse {
	errorCode: typeof InvalidRequestErrorCode;
	errors: InvalidRequestErrorsInfo;
}

interface AccessForbiddenErrorResponse extends BaseErrorResponse {
	errorCode: typeof AccessForbiddenErrorCode;
}

interface UnauthorizedErrorResponse extends BaseErrorResponse {
	errorCode: typeof UnauthorizedErrorCode;
}

interface NotFoundErrorResponse extends BaseErrorResponse {
	errorCode: typeof NotFoundErrorCode;
}

interface SomethingWrongErrorResponse extends BaseErrorResponse {
	errorCode: typeof SomethingWrongErrorCode;
}
