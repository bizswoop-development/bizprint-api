import type { StationsListOptions } from '#@/resources/Stations/StationsListOptions.ts';

import { InvalidRequestError } from '#@/errors/InvalidRequestError.ts';

export default class StationsListInvalidRequestError extends InvalidRequestError<StationsListOptions> {
	name = 'StationsListInvalidRequestError';
}
