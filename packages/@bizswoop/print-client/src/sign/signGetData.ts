import { createHash } from 'crypto';

type QueryArgs = URLSearchParams | string;

const hashData = (queryArgs, secretKey) => {
	return createHash('sha256').update(`${queryArgs.toString()}:${secretKey}`).digest('hex');
};

export const signGetData = (queryArgs: QueryArgs, secretKey): URLSearchParams => {
	queryArgs = new URLSearchParams(queryArgs);
	const time = `${Math.floor(Date.now() / 1000)}`;
	queryArgs.set('time', time);
	const hash = hashData(queryArgs.toString(), secretKey);
	queryArgs.set('hash', hash);

	return queryArgs;
};

export const validateGetData = (queryArgs: QueryArgs, secretKey) => {
	queryArgs = new URLSearchParams(queryArgs);
	const hash = queryArgs.get('hash');
	queryArgs.delete('hash');
	return hash === hashData(queryArgs, secretKey);
};
