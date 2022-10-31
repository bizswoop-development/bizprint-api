import axios, { AxiosInstance } from 'axios';

import { ApiListPromise } from '@/utilities/ApiListPromise';
import { ApiResponsePromise } from '@/utilities/ApiResponsePromise';
import makeRequest from '@/utilities/makeRequest';
import { wrapAsyncList } from '@/utilities/wrapAsyncList';
import { wrapListResponse } from '@/utilities/wrapListResponse';
import { wrapResponse } from '@/utilities/wrapResponse';

import AccessForbiddenError from '@/errors/AccessForbiddenError';
import { ErrorResponse } from '@/errors/ErrorResponse';

import { Job } from './Job';
import { JobCreateData } from './JobCreateData';
import JobCreatingInvalidRequestError from './JobCreatingInvalidRequestError';
import JobsListInvalidRequestError from './JobsListInvalidRequestError';
import { JobsListOptions } from './JobsListOptions';

export default class Jobs {
	protected _resourceBaseUrl = 'jobs';

	public constructor(_, protected _httpClient: AxiosInstance) {}

	async create(data: JobCreateData): ApiResponsePromise<Job> {
		const { printOption, ...rest } = data;
		const parsedData = {
			...rest,
			printOption: printOption ? JSON.stringify(printOption) : undefined
		};

		try {
			const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
				method: 'POST',
				data: parsedData
			});

			return wrapResponse(response, response.data.data as Job);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const data = error.response?.data as ErrorResponse;

				switch (data.errorCode) {
					case 'ERR_ACCESS_FORBIDDEN':
						throw new AccessForbiddenError(data.message);

					case 'ERR_INVALID_REQUEST': {
						throw new JobCreatingInvalidRequestError(data.message, data.errors);
					}

					default:
						throw error;
				}
			} else {
				throw error;
			}
		}
	}

	async retrieve(id: number): ApiResponsePromise<Job> {
		const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
			method: 'GET',
			url: `${id}`
		});

		return wrapResponse(response, response.data.data as Job);
	}

	list(options?: JobsListOptions): ApiListPromise<Job[]> {
		const result = makeRequest(
			this._httpClient,
			this._resourceBaseUrl,
			{
				method: 'GET',
				params: options
			},
			this.listError
		).then((response) => {
			const jobs = response.data.data as Job[];
			return wrapListResponse(response, jobs);
		});

		const iterator = wrapAsyncList(result, options, (options) => {
			return makeRequest(
				this._httpClient,
				this._resourceBaseUrl,
				{
					method: 'GET',
					params: options
				},
				this.listError
			).then((response) => {
				const jobs = response.data.data as Job[];
				return wrapListResponse(response, jobs);
			});
		});

		return Object.assign(result, iterator);
	}

	private listError(error) {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as ErrorResponse;
			switch (data.errorCode) {
				case 'ERR_INVALID_REQUEST':
					throw new JobsListInvalidRequestError(data.message, data.errors);
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}
}
