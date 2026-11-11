import type { ApiList } from './ApiList.ts';
import type { Response } from './Response.ts';

export type ApiListPromise<T> = Promise<Response<ApiList<T>>> &
	AsyncIterableIterator<Response<ApiList<T>>>;
