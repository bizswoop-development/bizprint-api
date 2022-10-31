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
				}
			]
		}
	);

const {
	publicKey,
	secretKey
} = await inquirer
	.prompt(
		[{
			name: 'publicKey',
			type: 'input',
			message: 'Public key'
		}, {
			name: 'secretKey',
			type: 'input',
			message: 'Secret key'
		}]
	);

switch (action) {
	case 'get': {
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

		url.delete('hash');
		url.delete('time');
		url.delete('publicKey');

		url.set('publicKey', publicKey);

		const result = signGetData(url, secretKey);

		console.log(result);
		process.exit(0);
		break;
	}
	case 'post': {
		const { json } = await inquirer
			.prompt(
				{
					name: 'json',
					type: 'editor',
					message: 'Enter JSON payload',
					filter(value) {
						try {
							const {
								time,
								hash,
								...data
							} = JSON.parse(value);
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
}
