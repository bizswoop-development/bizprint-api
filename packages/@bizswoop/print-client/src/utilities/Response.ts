export type Response<T> = T & {
	response: {
		headers: { [key: string]: string };
		statusCode: number;
	};
};
