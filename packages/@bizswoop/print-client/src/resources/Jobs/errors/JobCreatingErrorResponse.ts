import type { BaseErrorResponse } from '#@/errors/ErrorResponse.ts';

import { JobCreatingInvalidPrinterErrorCode } from './JobCreatingInvalidPrinterError.ts';
import { JobCreatingPrintJobLimitErrorCode } from './JobCreatingPrintJobLimitError.ts';

export type JobCreatingErrorResponse =
	| JobCreatingPrintJobLimitErrorResponse
	| JobCreatingInvalidPrinterErrorResponse;

interface JobCreatingPrintJobLimitErrorResponse extends BaseErrorResponse {
	errorCode: typeof JobCreatingPrintJobLimitErrorCode;
}

interface JobCreatingInvalidPrinterErrorResponse extends BaseErrorResponse {
	errorCode: typeof JobCreatingInvalidPrinterErrorCode;
}
