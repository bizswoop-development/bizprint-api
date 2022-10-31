import { Response } from '@/utilities/Response';

export type ApiResponsePromise<T> = Promise<Response<T>>;
