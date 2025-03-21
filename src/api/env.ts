import { ApiClient, createApiClient, makeRequest, useLocalServer, useRemoteServer } from './base';

export interface EnvClient extends ApiClient { }

// Constants for endpoints
const ENV_STATUS = 'status';

/**
 * Creates an environment client
 * @param apiKey Optional API key
 * @param serverUrl Optional server URL
 * @returns Environment client instance
 */
export const createEnvClient = (apiKey?: string, serverUrl?: string): EnvClient => {
    return createApiClient({
        apiKey,
        serverUrl,
        baseEndpointPath: 'env',
    });
};

/**
 * Sets the client to use local server
 * @param client Environment client
 * @returns Modified environment client
 */
export const useLocalEnvServer = (client: EnvClient): EnvClient =>
    useLocalServer(client);

/**
 * Sets the client to use remote server
 * @param client Environment client
 * @returns Modified environment client
 */
export const useRemoteEnvServer = (client: EnvClient): EnvClient =>
    useRemoteServer(client);

/**
 * Gets the environment status
 * @param client Environment client
 * @returns Promise resolving to environment status
 */
export const getEnvironmentStatus = async (client: EnvClient): Promise<Record<string, unknown>> => {
    return makeRequest<Record<string, unknown>>(client, 'get', ENV_STATUS);
}; 