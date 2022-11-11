import { BaseErrorResponse } from '@/errors/ErrorResponse';

import { JobCreatingInvalidPrinterErrorCode } from './JobCreatingInvalidPrinterError';
import { JobCreatingPrintJobLimitErrorCode } from './JobCreatingPrintJobLimitError';

export type JobCreatingErrorResponse =
	| JobCreatingPrintJobLimitErrorResponse
	| JobCreatingInvalidPrinterErrorResponse;

interface JobCreatingPrintJobLimitErrorResponse extends BaseErrorResponse {
	errorCode: typeof JobCreatingPrintJobLimitErrorCode;
}

interface JobCreatingInvalidPrinterErrorResponse extends BaseErrorResponse {
	errorCode: typeof JobCreatingInvalidPrinterErrorCode;
}
