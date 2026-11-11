import type { JobCreatingErrorResponse } from '#@/resources/Jobs/errors/JobCreatingErrorResponse.ts';

import { AccessForbiddenErrorCode } from '#@/errors/AccessForbiddenError.ts';
import {
	InvalidRequestErrorCode,
	type InvalidRequestErrorsInfo,
} from '#@/errors/InvalidRequestError.ts';
import { NotFoundErrorCode } from '#@/errors/NotFoundError.ts';
import { SomethingWrongErrorCode } from '#@/errors/SomethingWrongError.ts';
import { UnauthorizedErrorCode } from '#@/errors/UnauthorizedError.ts';

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
