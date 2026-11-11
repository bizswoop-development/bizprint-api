import type { Response } from '#@/utilities/Response.ts';

export type ApiResponsePromise<T> = Promise<Response<T>>;
