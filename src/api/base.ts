import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { createAuthenticationError, createNotteAPIError } from '../errors/sdk';

export const DEFAULT_SERVER_URL = 'https://api.notte.cc';
export const LOCAL_SERVER_URL = 'http://localhost:8000';
export const DEFAULT_REQUEST_TIMEOUT_SECONDS = 60;

export type HttpMethod = 'get' | 'post' | 'delete';

export interface Endpoint<TResponse, TRequest = void, TParams = void> {
    path: string;
    method: HttpMethod;
}

export interface ApiClientConfig {
    apiKey?: string;
    serverUrl?: string;
    baseEndpointPath?: string;
}

export interface ApiClient {
    httpClient: AxiosInstance;
    serverUrl: string;
    baseEndpointPath?: string;
}

/**
 * Creates a base API client
 * @param config API client configuration
 * @returns API client instance
 */
export const createApiClient = (config: ApiClientConfig): ApiClient => {
    const apiKey = config.apiKey || process.env.NOTTE_API_KEY;

    if (!apiKey) {
        throw createAuthenticationError();
    }

    const serverUrl = config.serverUrl || process.env.NOTTE_SERVER_URL || DEFAULT_SERVER_URL;

    const httpClient = axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        timeout: DEFAULT_REQUEST_TIMEOUT_SECONDS * 1000,
    });

    // Add response interceptor to handle errors
    httpClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw createNotteAPIError(
                    error.response.data?.message || 'API error',
                    error.response.status,
                    error.response.data
                );
            } else if (error.request) {
                // The request was made but no response was received
                throw createNotteAPIError('No response from server', undefined, error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                throw createNotteAPIError(error.message, undefined, error);
            }
        }
    );

    return {
        httpClient,
        serverUrl,
        baseEndpointPath: config.baseEndpointPath,
    };
};

/**
 * Sets the client to use the local server
 * @param client API client
 * @returns Modified API client
 */
export const useLocalServer = (client: ApiClient): ApiClient => ({
    ...client,
    serverUrl: LOCAL_SERVER_URL,
});

/**
 * Sets the client to use the remote server
 * @param client API client
 * @returns Modified API client
 */
export const useRemoteServer = (client: ApiClient): ApiClient => ({
    ...client,
    serverUrl: DEFAULT_SERVER_URL,
});

/**
 * Builds the full API URL for an endpoint
 * @param client API client
 * @param endpoint Endpoint path
 * @returns Full URL
 */
export const buildUrl = (client: ApiClient, endpoint: string): string => {
    const baseUrl = `${client.serverUrl}${client.baseEndpointPath ? `/${client.baseEndpointPath}` : ''}`;
    return `${baseUrl}/${endpoint}`;
};

/**
 * Makes an API request
 * @param client API client
 * @param method HTTP method
 * @param endpoint Endpoint path
 * @param data Request data
 * @param params Query parameters
 * @returns Promise resolving to the response data
 */
export const makeRequest = async <TResponse, TRequest = any, TParams = any>(
    client: ApiClient,
    method: HttpMethod,
    endpoint: string,
    data?: TRequest,
    params?: TParams
): Promise<TResponse> => {
    const url = buildUrl(client, endpoint);

    const config: AxiosRequestConfig = {
        params,
    };

    let response: AxiosResponse;

    switch (method) {
        case 'get':
            response = await client.httpClient.get<TResponse>(url, config);
            break;
        case 'post':
            response = await client.httpClient.post<TResponse>(url, data, config);
            break;
        case 'delete':
            response = await client.httpClient.delete<TResponse>(url, { ...config, data });
            break;
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
}; 