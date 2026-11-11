import axios, { type AxiosInstance } from 'axios';

import type { ApiListPromise } from '#@/utilities/ApiListPromise.ts';
import type { ApiResponsePromise } from '#@/utilities/ApiResponsePromise.ts';
import makeRequest from '#@/utilities/makeRequest.ts';
import { wrapAsyncList } from '#@/utilities/wrapAsyncList.ts';
import { wrapListResponse } from '#@/utilities/wrapListResponse.ts';
import { wrapResponse } from '#@/utilities/wrapResponse.ts';

import type { ErrorResponse } from '#@/errors/ErrorResponse.ts';
import { InvalidRequestErrorCode } from '#@/errors/InvalidRequestError.ts';

import PrintersListInvalidRequestError from './errors/PrintersListInvalidRequestError.ts';
import type { Printer } from './Printer.ts';
import type { PrintersListOptions } from './PrintersListOptions.ts';

export default class Printers {
	protected _resourceBaseUrl = 'printers';

	public constructor(
		_,
		protected _httpClient: AxiosInstance,
	) {}

	async retrieve(id: number): ApiResponsePromise<Printer> {
		const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
			method: 'GET',
			url: `${id}`,
		});

		return wrapResponse(response, response.data.data as Printer);
	}

	list(options?: PrintersListOptions): ApiListPromise<Printer[]> {
		const result = makeRequest(
			this._httpClient,
			this._resourceBaseUrl,
			{
				method: 'GET',
				params: options,
			},
			this._listError,
		).then((response) => {
			const printers = response.data.data as Printer[];
			return wrapListResponse(response, printers);
		});

		const iterator = wrapAsyncList(result, options, (options) => {
			return makeRequest(
				this._httpClient,
				this._resourceBaseUrl,
				{
					method: 'GET',
					params: options,
				},
				this._listError,
			).then((response) => {
				const printers = response.data.data as Printer[];
				return wrapListResponse(response, printers);
			});
		});

		return Object.assign(result, iterator);
	}

	private _listError(error) {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as ErrorResponse;
			switch (data?.errorCode) {
				case InvalidRequestErrorCode:
					throw new PrintersListInvalidRequestError(data.message, data.errors);
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}
}
