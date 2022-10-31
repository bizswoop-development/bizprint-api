import { ApiList } from '@/utilities/ApiList';
import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

export const wrapAsyncList = <T extends ApiList<any>, Q extends ApiListOptionsPagination>(
	firstValue: Promise<T>,
	options: Q,
	nextValueCallback: (options: Q) => Promise<T>
): AsyncIterableIterator<T> => {
	let firstCall = true;
	let done = false;
	let nextOptions = { ...options };
	const iterator = {
		next: async () => {
			if (done) {
				return { done: true, value: undefined };
			}
			const value = await (firstCall ? firstValue : nextValueCallback(nextOptions));

			if (firstCall) firstCall = false;

			const result = {
				done,
				value
			};

			if (!value.hasMore) {
				done = true;
			}

			nextOptions = { ...nextOptions, page: nextOptions.page ? nextOptions.page + 1 : 2 };

			return result;
		},
		[Symbol.asyncIterator]: () => iterator
	};

	return iterator;
};
