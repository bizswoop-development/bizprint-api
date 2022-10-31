import { createHash } from 'crypto';

const hashData = (data, secretKey) => {
	const json = JSON.stringify(data);

	return createHash('sha256').update(`${json}:${secretKey}`).digest('hex');
};

export const signPostData = <T>(data: T, secretKey: string): T & { time: number; hash: string } => {
	const time = Math.floor(Date.now() / 1000);

	const dataWithTime = {
		...data,
		time
	};
	const hash = hashData(dataWithTime, secretKey);
	return { ...dataWithTime, hash } as T & { time: number; hash: string };
};

export const validatePostData = ({ hash, ...data }, secretKey) => {
	return hash === hashData(data, secretKey);
};
