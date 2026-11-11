import { createHash } from 'crypto';

type QueryArgs = URLSearchParams | string;

export const hashGetData = (queryArgs: QueryArgs, secretKey: string): string => {
	return createHash('sha256').update(`${queryArgs.toString()}:${secretKey}`).digest('hex');
};

export const signGetData = (
	queryArgs: QueryArgs,
	publicKey: string,
	secretKey: string,
): URLSearchParams => {
	queryArgs = new URLSearchParams(queryArgs);
	const time = `${Math.floor(Date.now() / 1000)}`;

	queryArgs.set('publicKey', publicKey);
	queryArgs.set('time', time);

	const hash = hashGetData(queryArgs.toString(), secretKey);
	queryArgs.set('hash', hash);

	return queryArgs;
};

export const validateGetData = (queryArgs: QueryArgs, secretKey) => {
	queryArgs = new URLSearchParams(queryArgs);
	const hash = queryArgs.get('hash');
	queryArgs.delete('hash');
	return hash === hashGetData(queryArgs, secretKey);
};
