import { createHash } from 'crypto';

const hashData = (data, secretKey) => {
	const json = JSON.stringify(data);

	return createHash('sha256').update(`${json}:${secretKey}`).digest('hex');
};

export const signPostData = <T>(
	data: T,
	publicKey: string,
	secretKey: string
): T & { publicKey: string; time: number; hash: string } => {
	const time = Math.floor(Date.now() / 1000);

	const dataToSign = {
		...data,
		publicKey,
		time
	};
	const hash = hashData(dataToSign, secretKey);
	return { ...dataToSign, hash } as T & { publicKey: string; time: number; hash: string };
};

export const validatePostData = ({ hash, ...data }, secretKey) => {
	return hash === hashData(data, secretKey);
};
