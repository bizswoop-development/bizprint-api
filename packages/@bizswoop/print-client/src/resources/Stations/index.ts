import axios, { AxiosInstance } from 'axios';

import { ApiListPromise } from '@/utilities/ApiListPromise';
import { ApiResponsePromise } from '@/utilities/ApiResponsePromise';
import makeRequest from '@/utilities/makeRequest';
import { wrapAsyncList } from '@/utilities/wrapAsyncList';
import { wrapListResponse } from '@/utilities/wrapListResponse';
import { wrapResponse } from '@/utilities/wrapResponse';

import StationsListInvalidRequestError from './errors/StationsListInvalidRequestError';
import { ErrorResponse } from '@/errors/ErrorResponse';
import { InvalidRequestErrorCode } from '@/errors/InvalidRequestError';

import { Station } from './Station';
import { StationsListOptions } from './StationsListOptions';

export default class Stations {
	protected _resourceBaseUrl = 'stations';

	public constructor(_, protected _httpClient: AxiosInstance) {}

	async retrieve(id: number): ApiResponsePromise<Station> {
		const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
			method: 'GET',
			url: `${id}`
		});

		return wrapResponse(response, response.data.data as Station);
	}

	list(options?: StationsListOptions): ApiListPromise<Station[]> {
		const result = makeRequest(
			this._httpClient,
			this._resourceBaseUrl,
			{
				method: 'GET',
				params: options
			},
			this._listError
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
					params: options
				},
				this._listError
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
			switch (data.errorCode) {
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
