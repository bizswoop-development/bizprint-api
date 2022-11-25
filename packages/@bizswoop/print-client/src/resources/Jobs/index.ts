import axios, { AxiosInstance } from 'axios';

import { ApiListPromise } from '@/utilities/ApiListPromise';
import { ApiResponsePromise } from '@/utilities/ApiResponsePromise';
import makeRequest from '@/utilities/makeRequest';
import { wrapAsyncList } from '@/utilities/wrapAsyncList';
import { wrapListResponse } from '@/utilities/wrapListResponse';
import { wrapResponse } from '@/utilities/wrapResponse';

import JobCreatingInvalidPrinterError, {
	JobCreatingInvalidPrinterErrorCode
} from './errors/JobCreatingInvalidPrinterError';
import JobCreatingInvalidRequestError from './errors/JobCreatingInvalidRequestError';
import JobCreatingPrintJobLimitError, {
	JobCreatingPrintJobLimitErrorCode
} from './errors/JobCreatingPrintJobLimitError';
import JobsListInvalidRequestError from './errors/JobsListInvalidRequestError';
import { ErrorResponse } from '@/errors/ErrorResponse';
import { InvalidRequestErrorCode } from '@/errors/InvalidRequestError';

import { Job } from './Job';
import { JobCreateData } from './JobCreateData';
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
			this._listError
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
				this._listError
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
			switch (data.errorCode) {
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
