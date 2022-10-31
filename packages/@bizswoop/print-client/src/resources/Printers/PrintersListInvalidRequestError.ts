import { PrintersListOptions } from '@/resources/Printers/PrintersListOptions';

import { InvalidRequestError } from '@/errors/InvalidRequestError';

export default class PrintersListInvalidRequestError extends InvalidRequestError<PrintersListOptions> {
	name = 'PrintersListInvalidRequestError';
}
