import { createInvalidRequestError } from '../errors/sdk';
import { AgentListRequest, AgentResponse, AgentRunRequest, AgentStatusResponse } from '../types';
import { ApiClient, createApiClient, makeRequest, useLocalServer, useRemoteServer } from './base';

export interface AgentsClient extends ApiClient {
    lastAgentResponse: AgentResponse | null;
}

// Constants for endpoints
const AGENT_RUN = 'run';
const AGENT_STOP = '{agent_id}/stop';
const AGENT_STATUS = '{agent_id}';
const AGENT_LIST = '';

/**
 * Creates an agents client
 * @param apiKey Optional API key
 * @param serverUrl Optional server URL
 * @returns Agents client instance
 */
export const createAgentsClient = (apiKey?: string, serverUrl?: string): AgentsClient => {
    const baseClient = createApiClient({
        apiKey,
        serverUrl,
        baseEndpointPath: 'agents',
    });

    return {
        ...baseClient,
        lastAgentResponse: null,
    };
};

/**
 * Sets the client to use local server
 * @param client Agents client
 * @returns Modified agents client
 */
export const useLocalAgentsServer = (client: AgentsClient): AgentsClient => ({
    ...useLocalServer(client),
    lastAgentResponse: client.lastAgentResponse,
});

/**
 * Sets the client to use remote server
 * @param client Agents client
 * @returns Modified agents client
 */
export const useRemoteAgentsServer = (client: AgentsClient): AgentsClient => ({
    ...useRemoteServer(client),
    lastAgentResponse: client.lastAgentResponse,
});

/**
 * Runs an agent
 * @param client Agents client
 * @param request Agent run request
 * @returns Promise resolving to updated client
 */
export const runAgent = async (
    client: AgentsClient,
    request: AgentRunRequest
): Promise<AgentsClient> => {
    const response = await makeRequest<AgentResponse, AgentRunRequest>(
        client,
        'post',
        AGENT_RUN,
        request
    );

    return {
        ...client,
        lastAgentResponse: response,
    };
};

/**
 * Stops an agent
 * @param client Agents client
 * @param agentId Agent ID
 * @returns Promise resolving to updated client
 */
export const stopAgent = async (
    client: AgentsClient,
    agentId?: string
): Promise<AgentsClient> => {
    // Use the agent ID from the last response if not provided
    const resolvedAgentId = agentId || client.lastAgentResponse?.id;

    if (!resolvedAgentId) {
        throw createInvalidRequestError('Agent ID is required');
    }

    const endpoint = AGENT_STOP.replace('{agent_id}', resolvedAgentId);
    const response = await makeRequest<AgentStatusResponse>(client, 'delete', endpoint);

    return {
        ...client,
        lastAgentResponse: {
            ...response,
            data: response.output,
        },
    };
};

/**
 * Gets agent status
 * @param client Agents client
 * @param agentId Agent ID
 * @returns Promise resolving to agent status
 */
export const getAgentStatus = async (
    client: AgentsClient,
    agentId?: string
): Promise<AgentStatusResponse> => {
    // Use the agent ID from the last response if not provided
    const resolvedAgentId = agentId || client.lastAgentResponse?.id;

    if (!resolvedAgentId) {
        throw createInvalidRequestError('Agent ID is required');
    }

    const endpoint = AGENT_STATUS.replace('{agent_id}', resolvedAgentId);
    return makeRequest<AgentStatusResponse>(client, 'get', endpoint);
};

/**
 * Lists agents
 * @param client Agents client
 * @param request List request parameters
 * @returns Promise resolving to list of agents
 */
export const listAgents = async (
    client: AgentsClient,
    request: AgentListRequest = { only_active: true, limit: 10 }
): Promise<AgentResponse[]> => {
    return makeRequest<AgentResponse[], void, AgentListRequest>(
        client,
        'get',
        AGENT_LIST,
        undefined,
        request
    );
}; 