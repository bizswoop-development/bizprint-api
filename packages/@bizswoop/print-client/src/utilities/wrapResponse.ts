import { AxiosHeaders, type AxiosResponse } from 'axios';

import type { Response } from '#@/utilities/Response.ts';

export const wrapResponse = <T>(response: AxiosResponse, data: T): Response<T> => {
	return {
		...data,
		response: {
			// axios 1.x returns an AxiosHeaders instance; keep the public plain-object contract
			headers: AxiosHeaders.from(response.headers).toJSON(true),
			statusCode: response.status,
		},
	};
};
