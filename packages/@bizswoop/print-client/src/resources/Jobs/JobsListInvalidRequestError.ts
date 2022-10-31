import { InvalidRequestError } from '@/errors/InvalidRequestError';

import { JobsListOptions } from './JobsListOptions';

export default class JobsListInvalidRequestError extends InvalidRequestError<JobsListOptions> {
	name = 'JobsListInvalidRequestError';
}
