import type { PrintersListOptions } from '#@/resources/Printers/PrintersListOptions.ts';

import { InvalidRequestError } from '#@/errors/InvalidRequestError.ts';

export default class PrintersListInvalidRequestError extends InvalidRequestError<PrintersListOptions> {
	name = 'PrintersListInvalidRequestError';
}
