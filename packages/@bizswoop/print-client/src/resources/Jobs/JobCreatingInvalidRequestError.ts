import { InvalidRequestError } from '@/errors/InvalidRequestError';

import { JobCreateData } from './JobCreateData';

export default class JobCreatingInvalidRequestError extends InvalidRequestError<JobCreateData> {
	name = 'JobCreatingInvalidRequestError';
}
