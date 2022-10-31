import { AxiosResponse } from 'axios';

import { Response } from '@/utilities/Response';

export const wrapResponse = <T>(response: AxiosResponse, data: T): Response<T> => {
	return {
		...data,
		response: {
			headers: response.headers,
			statusCode: response.status
		}
	};
};
