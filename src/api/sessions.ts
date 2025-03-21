import { createInvalidRequestError } from '../errors/sdk';
import { SessionListRequest, SessionResponse, SessionStartRequest } from '../types';
import { ApiClient, createApiClient, makeRequest, useLocalServer, useRemoteServer } from './base';

export interface SessionsClient extends ApiClient {
    lastSessionResponse: SessionResponse | null;
}

// Constants for endpoints
const SESSION_START = 'start';
const SESSION_CLOSE = '{session_id}/close';
const SESSION_STATUS = '{session_id}';
const SESSION_LIST = '';

/**
 * Creates a sessions client
 * @param apiKey Optional API key
 * @param serverUrl Optional server URL
 * @returns Sessions client instance
 */
export const createSessionsClient = (apiKey?: string, serverUrl?: string): SessionsClient => {
    const baseClient = createApiClient({
        apiKey,
        serverUrl,
        baseEndpointPath: 'sessions',
    });

    return {
        ...baseClient,
        lastSessionResponse: null,
    };
};

/**
 * Sets the client to use local server
 * @param client Sessions client
 * @returns Modified sessions client
 */
export const useLocalSessionsServer = (client: SessionsClient): SessionsClient => ({
    ...useLocalServer(client),
    lastSessionResponse: client.lastSessionResponse,
});

/**
 * Sets the client to use remote server
 * @param client Sessions client
 * @returns Modified sessions client
 */
export const useRemoteSessionsServer = (client: SessionsClient): SessionsClient => ({
    ...useRemoteServer(client),
    lastSessionResponse: client.lastSessionResponse,
});

/**
 * Starts a new session
 * @param client Sessions client
 * @param request Session start request
 * @returns Promise resolving to session response
 */
export const startSession = async (
    client: SessionsClient,
    request: SessionStartRequest
): Promise<SessionsClient> => {
    const response = await makeRequest<SessionResponse, SessionStartRequest>(
        client,
        'post',
        SESSION_START,
        request
    );

    return {
        ...client,
        lastSessionResponse: response,
    };
};

/**
 * Closes a session
 * @param client Sessions client
 * @param sessionId Session ID
 * @returns Promise resolving to updated client
 */
export const closeSession = async (
    client: SessionsClient,
    sessionId?: string
): Promise<SessionsClient> => {
    // Use the session ID from the last response if not provided
    const resolvedSessionId = sessionId || client.lastSessionResponse?.id;

    if (!resolvedSessionId) {
        throw createInvalidRequestError('Session ID is required');
    }

    const endpoint = SESSION_CLOSE.replace('{session_id}', resolvedSessionId);
    const response = await makeRequest<SessionResponse>(client, 'delete', endpoint);

    return {
        ...client,
        lastSessionResponse: response,
    };
};

/**
 * Gets session status
 * @param client Sessions client
 * @param sessionId Session ID
 * @returns Promise resolving to updated client
 */
export const getSessionStatus = async (
    client: SessionsClient,
    sessionId?: string
): Promise<SessionsClient> => {
    // Use the session ID from the last response if not provided
    const resolvedSessionId = sessionId || client.lastSessionResponse?.id;

    if (!resolvedSessionId) {
        throw createInvalidRequestError('Session ID is required');
    }

    const endpoint = SESSION_STATUS.replace('{session_id}', resolvedSessionId);
    const response = await makeRequest<SessionResponse>(client, 'get', endpoint);

    return {
        ...client,
        lastSessionResponse: response,
    };
};

/**
 * Lists sessions
 * @param client Sessions client
 * @param request List request parameters
 * @returns Promise resolving to list of sessions
 */
export const listSessions = async (
    client: SessionsClient,
    request: SessionListRequest = { only_active: true, limit: 10 }
): Promise<SessionResponse[]> => {
    return makeRequest<SessionResponse[], void, SessionListRequest>(
        client,
        'get',
        SESSION_LIST,
        undefined,
        request
    );
}; 