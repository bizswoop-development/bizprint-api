import { PrintersListOptions } from '@/resources/Printers/PrintersListOptions';

import { InvalidRequestError } from '@/errors/InvalidRequestError';

export default class StationsListInvalidRequestError extends InvalidRequestError<PrintersListOptions> {
	name = 'StationsListInvalidRequestError';
}
