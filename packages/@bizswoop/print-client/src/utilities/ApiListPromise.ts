import { ApiList } from './ApiList';
import { Response } from './Response';

export type ApiListPromise<T> = Promise<Response<ApiList<T>>> &
	AsyncIterableIterator<Response<ApiList<T>>>;
