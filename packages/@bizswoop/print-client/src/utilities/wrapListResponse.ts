import { AxiosResponse } from 'axios';

import { ApiList } from '@/utilities/ApiList';
import { Response } from '@/utilities/Response';
import { wrapResponse } from '@/utilities/wrapResponse';

export const wrapListResponse = <T extends Array<any>>(
	response: AxiosResponse,
	data: T
): Response<ApiList<T>> => {
	const hasMore = response.headers['has-more'] === 'true';

	return wrapResponse(response, { data, hasMore });
};
