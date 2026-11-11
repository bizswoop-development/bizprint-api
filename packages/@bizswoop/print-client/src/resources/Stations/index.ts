import axios, { type AxiosInstance } from 'axios';

import type { ApiListPromise } from '#@/utilities/ApiListPromise.ts';
import type { ApiResponsePromise } from '#@/utilities/ApiResponsePromise.ts';
import makeRequest from '#@/utilities/makeRequest.ts';
import { wrapAsyncList } from '#@/utilities/wrapAsyncList.ts';
import { wrapListResponse } from '#@/utilities/wrapListResponse.ts';
import { wrapResponse } from '#@/utilities/wrapResponse.ts';

import type { ErrorResponse } from '#@/errors/ErrorResponse.ts';
import { InvalidRequestErrorCode } from '#@/errors/InvalidRequestError.ts';

import StationsListInvalidRequestError from './errors/StationsListInvalidRequestError.ts';
import type { Station } from './Station.ts';
import type { StationsListOptions } from './StationsListOptions.ts';

export default class Stations {
	protected _resourceBaseUrl = 'stations';

	public constructor(
		_,
		protected _httpClient: AxiosInstance,
	) {}

	async retrieve(id: number): ApiResponsePromise<Station> {
		const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
			method: 'GET',
			url: `${id}`,
		});

		return wrapResponse(response, response.data.data as Station);
	}

	list(options?: StationsListOptions): ApiListPromise<Station[]> {
		const result = makeRequest(
			this._httpClient,
			this._resourceBaseUrl,
			{
				method: 'GET',
				params: options,
			},
			this._listError,
		).then((response) => {
			const printers = response.data.data as Station[];
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
				const printers = response.data.data as Station[];
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
					throw new StationsListInvalidRequestError(data.message, data.errors);
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}
}
