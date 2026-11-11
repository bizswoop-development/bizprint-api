import type { AxiosResponse } from 'axios';

import type { ApiList } from '#@/utilities/ApiList.ts';
import type { Response } from '#@/utilities/Response.ts';
import { wrapResponse } from '#@/utilities/wrapResponse.ts';

export const wrapListResponse = <T extends Array<any>>(
	response: AxiosResponse,
	data: T,
): Response<ApiList<T>> => {
	const hasMore = response.headers['x-biz-has-more'] === 'true';
	const totalAll = parseInt(response.headers['x-biz-total-all'], 10);
	const totalPages = parseInt(response.headers['x-biz-total-pages'], 10);

	return wrapResponse(response, { data, hasMore, totalAll, totalPages });
};
