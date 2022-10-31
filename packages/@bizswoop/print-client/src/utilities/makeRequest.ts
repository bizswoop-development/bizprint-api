import { AxiosInstance, default as axios } from 'axios';

import { ErrorResponse } from '@/errors/ErrorResponse';
import UnauthorizedError from '@/errors/UnauthorizedError';

const makeRequest = async (
	httpClient: AxiosInstance,
	resourceBaseUrl,
	{
		method,
		url = '',
		data,
		params
	}: {
		method: string;
		url?: string;
		data?: any;
		params?: any;
	},
	errorHandler?: Function
) => {
	try {
		return await httpClient.request({
			method,
			url: `${resourceBaseUrl}/${url}`,
			data,
			params
		});
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as ErrorResponse;
			if (data.errorCode === 'ERR_UNAUTHORIZED') {
				throw new UnauthorizedError(data.message);
			}
		}

		if (errorHandler) {
			throw errorHandler(error);
		} else {
			throw error;
		}
	}
};

export default makeRequest;
