export const JobCreatingInvalidPrinterErrorCode = 'ERR_JOB_CREATING_INVALID_PRINTER_ID';

export default class JobCreatingInvalidPrinterError extends Error {
	kind = 'JobCreatingInvalidPrinterError';
	name = 'JobCreatingInvalidPrinterError';

	constructor(message: string) {
		super(message);
	}
}
