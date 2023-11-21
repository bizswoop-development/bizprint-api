import crypto from 'crypto';

const hashGetData = (queryArgs, secretKey) => {
	return crypto.createHash('sha256').update(`${queryArgs.toString()}:${secretKey}`).digest('hex');
};

const hashPostData = (data, secretKey) => {
	const json = JSON.stringify(data);

	return crypto.createHash('sha256')
		.update(`${json}:${secretKey}`)
		.digest('hex');
};

export const signGetData = (queryArgs, secretKey) => {
	queryArgs = new URLSearchParams(queryArgs);

	if(!queryArgs.has('time')) {
		queryArgs.set('time', `${Math.floor(Date.now() / 1000)}`);
	}
	const hash = hashGetData(queryArgs.toString(), secretKey);

	queryArgs.set('hash', hash);
	return queryArgs.toString();
};

export const signPostData = (data, secretKey) => {
	if (!data.hasOwnProperty("time")) {
		data.time = Math.floor(Date.now() / 1000);
	}
	const hash = hashPostData(data, secretKey);
	return {
		...data,
		hash
	};
};
