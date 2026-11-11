import type { JobCreateData } from '#@/resources/Jobs/JobCreateData.ts';

import { InvalidRequestError } from '#@/errors/InvalidRequestError.ts';

export default class JobCreatingInvalidRequestError extends InvalidRequestError<JobCreateData> {
	name = 'JobCreatingInvalidRequestError';
}
