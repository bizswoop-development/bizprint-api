import type { JobsListOptions } from '#@/resources/Jobs/JobsListOptions.ts';

import { InvalidRequestError } from '#@/errors/InvalidRequestError.ts';

export default class JobsListInvalidRequestError extends InvalidRequestError<JobsListOptions> {
	name = 'JobsListInvalidRequestError';
}
