import axios, { AxiosInstance } from 'axios';

import Jobs from '@/resources/Jobs';
import Printers from '@/resources/Printers';
import Stations from '@/resources/Stations';

import { signGetData } from '@/sign/signGetData';
import { signPostData } from '@/sign/signPostData';

interface PrintClientAuthConfig {
	publicKey: string;
	secretKey: string;
}

type Protocol = 'http' | 'https';

type BaseUrl = `${Protocol}://${string}/api/connect-application/v1/`;

const defaultBaseUrl = 'https://print.bizswoop.app/api/connect-application/v1/';

type PrintClientConfig = {
	baseUrl?: BaseUrl;
} & PrintClientAuthConfig;

const resources = { Jobs, Printers, Stations };

export default class PrintClient {
	protected _httpClient: AxiosInstance;
	private _auth: PrintClientAuthConfig;

	Jobs: Jobs;
	Printers: Printers;
	Stations: Stations;

	constructor(config: PrintClientConfig) {
		this._auth = {
			publicKey: config.publicKey,
			secretKey: config.secretKey
		};

		this._httpClient = axios.create({
			baseURL: config.baseUrl || defaultBaseUrl
		});

		this._setupInterceptors();
		this._prepareResources();
	}

	private _setupInterceptors() {
		this._httpClient.interceptors.request.use((config) => {
			switch (config.method.toLowerCase()) {
				case 'get':
				case 'delete': {
					if (!config.params) config.params = {};
					config.params.publicKey = this._auth.publicKey;
					const url = new URL(axios.getUri(config));
					const signedUrlParams = signGetData(url.searchParams, this._auth.secretKey);
					config.params.time = signedUrlParams.get('time');
					config.params.hash = signedUrlParams.get('hash');
					break;
				}
				case 'patch':
				case 'post':
				case 'put': {
					if (!config.data) config.data = {};
					config.data.publicKey = this._auth.publicKey;
					const { hash, time } = signPostData(config.data, this._auth.secretKey);
					config.data.time = time;
					config.data.hash = hash;
					break;
				}
			}

			return config;
		});
	}

	private _prepareResources() {
		for (let resourceName in resources) {
			this[resourceName] = new resources[resourceName](this, this._httpClient);
		}
	}
}
