export const JobCreatingPrintJobLimitErrorCode = 'ERR_JOB_CREATING_PRINT_JOB_LIMIT';

export default class JobCreatingPrintJobLimitError extends Error {
	kind = 'JobCreatingPrintJobLimitError';
	name = 'JobCreatingPrintJobLimitError';

	constructor(message: string) {
		super(message);
	}
}
