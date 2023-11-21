#!/usr/bin/env node

import inquirer from 'inquirer';
import { signPostData, signGetData } from './sign.mjs';

const { action } = await inquirer
	.prompt(
		{
			name: 'action',
			type: 'list',
			message: 'What do you want to do?',
			choices: [
				{
					name: 'Make a get request',
					value: 'get'
				},
				{
					name: 'Make a post request',
					value: 'post'
				},
				{
					name: 'Validate a get request',
					value: 'validate-get'
				},
				{
					name: 'Validate a post request',
					value: 'validate-post'
				}
			]
		}
	);

switch (action) {
	case 'get': {
		const { publicKey, secretKey } = await requestKeys("publicKey", "secretKey");

		const { url } = await inquirer
			.prompt(
				{
					name: 'url',
					type: 'text',
					message: 'Enter Request URL or query string',
					filter(value) {
						try {
							try {
								return (new URL(value)).searchParams;
							} catch {
								return new URLSearchParams(value);
							}
						} catch {
							return value;
						}
					},
					validate(value) {
						if (value == null) {
							return 'Must be valid Request URL or query string.';
						}

						return true;
					}
				}
			);

		const { updateTime } = await inquirer.prompt({
			name: 'updateTime',
			type: 'confirm',
			message: 'Update time?',
			default: true
		});

		if (updateTime) url.delete('time');
		url.delete('hash');
		url.delete('publicKey');

		url.set('publicKey', publicKey);

		const result = signGetData(url, secretKey);

		console.log(result);
		process.exit(0);
		break;
	}
	case 'post': {
		const { publicKey, secretKey } = await requestKeys("publicKey", "secretKey");

		const { updateTime } = await inquirer.prompt({
			name: 'updateTime',
			type: 'confirm',
			message: 'Update time?',
			default: true
		});

		const { json } = await inquirer
			.prompt(
				{
					name: 'json',
					type: 'editor',
					message: 'Enter JSON payload',
					filter(value) {
						try {
							const data = JSON.parse(value);
							if (updateTime) delete data.time;
							delete data.hash;
							return data;
						} catch {
							return null;
						}
					},
					validate(value) {
						if (value == null) {
							return 'Must be valid JSON.';
						}

						return true;
					}
				}
			);

		json.publicKey = publicKey;

		const result = signPostData(json, secretKey);

		console.log(JSON.stringify(result));
		process.exit(0);
		break;
	}
	case 'validate-get': {
		const { secretKey } = await requestKeys("secretKey");

		const { originalUrl } = await inquirer
			.prompt(
				{
					name: 'originalUrl',
					type: 'text',
					message: 'Enter Request URL or query string',
					filter(value) {
						try {
							try {
								return (new URL(value)).searchParams;
							} catch {
								return new URLSearchParams(value);
							}
						} catch {
							return value;
						}
					},
					validate(value) {
						if (value == null) {
							return 'Must be valid Request URL or query string.';
						}

						return true;
					}
				}
			);


		let invalid = [];

		if (!originalUrl.has("time")) invalid.push("time");
		if (!originalUrl.has("publicKey")) invalid.push("publicKey");
		if (!originalUrl.has("hash")) invalid.push("hash");

		if (invalid.length > 0) {
			console.log("Invalid, missing arguments: " + invalid.join(", "));
			process.exit(0);
		}

		let url = new URLSearchParams(originalUrl);

		url.delete('hash');

		const signedUrl = new URLSearchParams(signGetData(url, secretKey));
		const result = signedUrl.get('hash') === originalUrl.get('hash');


		console.log(result ? 'Valid' : `Invalid (hash mismatch), expected ${signedUrl.get('hash')} got ${originalUrl.get('hash')}`);
		process.exit(0);
		break;
	}
	case 'validate-post': {
		const { secretKey } = await requestKeys("secretKey");

		const { originalJson } = await inquirer
			.prompt(
				{
					name: 'originalJson',
					type: 'editor',
					message: 'Enter JSON payload',
					filter(value) {
						try {
							return JSON.parse(value);
						} catch {
							return null;
						}
					},
					validate(value) {
						if (value == null) {
							return 'Must be valid JSON.';
						}

						return true;
					}
				}
			);

		let invalid = [];

		if (!originalJson.hasOwnProperty('time')) invalid.push("time");
		if (!originalJson.hasOwnProperty('publicKey')) invalid.push("publicKey");
		if (!originalJson.hasOwnProperty('hash')) invalid.push("hash");

		if (invalid.length > 0) {
			console.log("Invalid, missing arguments: " + invalid.join(", "));
			process.exit(0);
		}

		const json = { ...originalJson };
		delete json.hash;

		const signedJson = signPostData(json, secretKey);

		const result = signedJson.hash === originalJson.hash;

		console.log(result ? 'Valid' : `Invalid (hash mismatch), expected ${signedJson.hash} got ${originalJson.hash}`);
		process.exit(0);
		break;
	}
}

async function requestKeys(...keys) {

	const allowedInputs = [{
		name: "publicKey",
		type: "input",
		message: "Public key"
	}, {
		name: "secretKey",
		type: "input",
		message: "Secret key"
	}];

	const inputs = allowedInputs.filter(({ name }) => keys.includes(name));

	return await inquirer
		.prompt(
			inputs
		);
}
