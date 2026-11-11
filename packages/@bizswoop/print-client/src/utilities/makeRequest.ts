import { type AxiosInstance, default as axios } from 'axios';

import AccessForbiddenError, { AccessForbiddenErrorCode } from '#@/errors/AccessForbiddenError.ts';
import type { ErrorResponse } from '#@/errors/ErrorResponse.ts';
import NotFoundError, { NotFoundErrorCode } from '#@/errors/NotFoundError.ts';
import SomethingWrongError, { SomethingWrongErrorCode } from '#@/errors/SomethingWrongError.ts';
import UnauthorizedError, { UnauthorizedErrorCode } from '#@/errors/UnauthorizedError.ts';

const makeRequest = async (
	httpClient: AxiosInstance,
	resourceBaseUrl,
	{
		method,
		url = '',
		data,
		params,
	}: {
		method: string;
		url?: string;
		data?: any;
		params?: any;
	},
	errorHandler?: Function,
) => {
	try {
		return await httpClient.request({
			method,
			url: `${resourceBaseUrl}/${url}`,
			data,
			params,
		});
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as ErrorResponse;
			switch (data?.errorCode) {
				case AccessForbiddenErrorCode:
					throw new AccessForbiddenError(data.message);
				case SomethingWrongErrorCode:
					throw new SomethingWrongError(data.message);
				case UnauthorizedErrorCode:
					throw new UnauthorizedError(data.message);
				case NotFoundErrorCode:
					throw new NotFoundError(data.message);
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
