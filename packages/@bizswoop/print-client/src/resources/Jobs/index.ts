import axios, { type AxiosInstance } from 'axios';

import type { ApiListPromise } from '#@/utilities/ApiListPromise.ts';
import type { ApiResponsePromise } from '#@/utilities/ApiResponsePromise.ts';
import makeRequest from '#@/utilities/makeRequest.ts';
import { wrapAsyncList } from '#@/utilities/wrapAsyncList.ts';
import { wrapListResponse } from '#@/utilities/wrapListResponse.ts';
import { wrapResponse } from '#@/utilities/wrapResponse.ts';

import type { ErrorResponse } from '#@/errors/ErrorResponse.ts';
import { InvalidRequestErrorCode } from '#@/errors/InvalidRequestError.ts';

import JobCreatingInvalidPrinterError, {
	JobCreatingInvalidPrinterErrorCode,
} from './errors/JobCreatingInvalidPrinterError.ts';
import JobCreatingInvalidRequestError from './errors/JobCreatingInvalidRequestError.ts';
import JobCreatingPrintJobLimitError, {
	JobCreatingPrintJobLimitErrorCode,
} from './errors/JobCreatingPrintJobLimitError.ts';
import JobsListInvalidRequestError from './errors/JobsListInvalidRequestError.ts';
import type { Job } from './Job.ts';
import type { JobCreateData } from './JobCreateData.ts';
import type { JobsListOptions } from './JobsListOptions.ts';

export default class Jobs {
	protected _resourceBaseUrl = 'jobs';

	public constructor(
		_,
		protected _httpClient: AxiosInstance,
	) {}

	async create(data: JobCreateData): ApiResponsePromise<Job> {
		const { printOption, ...rest } = data;
		const parsedData = {
			...rest,
			printOption: printOption ? JSON.stringify(printOption) : undefined,
		};

		try {
			const response = await makeRequest(this._httpClient, this._resourceBaseUrl, {
				method: 'POST',
				data: parsedData,
			});

			return wrapResponse(response, response.data.data as Job);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const data = error.response?.data as ErrorResponse;

				switch (data?.errorCode) {
					case InvalidRequestErrorCode: {
						throw new JobCreatingInvalidRequestError(data.message, data.errors);
					}
					case JobCreatingPrintJobLimitErrorCode: {
						throw new JobCreatingPrintJobLimitError(data.message);
					}
					case JobCreatingInvalidPrinterErrorCode: {
						throw new JobCreatingInvalidPrinterError(data.message);
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
			url: `${id}`,
		});

		return wrapResponse(response, response.data.data as Job);
	}

	list(options?: JobsListOptions): ApiListPromise<Job[]> {
		const result = makeRequest(
			this._httpClient,
			this._resourceBaseUrl,
			{
				method: 'GET',
				params: options,
			},
			this._listError,
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
					params: options,
				},
				this._listError,
			).then((response) => {
				const jobs = response.data.data as Job[];
				return wrapListResponse(response, jobs);
			});
		});

		return Object.assign(result, iterator);
	}

	private _listError(error) {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as ErrorResponse;
			switch (data?.errorCode) {
				case InvalidRequestErrorCode:
					throw new JobsListInvalidRequestError(data.message, data.errors);
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}
}
