import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Re-export error utilities
export { ErrorMessageMode, ErrorMode, getErrorMode, setErrorMode } from './errors/base';

// Re-export types
export * from './types';

// Re-export API clients
import {
    closeSession,
    createSessionsClient,
    getSessionStatus,
    listSessions,
    SessionsClient,
    startSession,
    useLocalSessionsServer,
    useRemoteSessionsServer
} from './api/sessions';

import {
    AgentsClient,
    createAgentsClient,
    getAgentStatus,
    listAgents,
    runAgent,
    stopAgent,
    useLocalAgentsServer,
    useRemoteAgentsServer
} from './api/agents';

import {
    createEnvClient,
    EnvClient,
    getEnvironmentStatus,
    useLocalEnvServer,
    useRemoteEnvServer
} from './api/env';

export interface NotteClient {
    sessions: SessionsClient;
    agents: AgentsClient;
    env: EnvClient;
}

/**
 * Creates a Notte client with access to all APIs
 * @param apiKey Optional API key (defaults to NOTTE_API_KEY env var)
 * @param serverUrl Optional server URL
 * @returns Notte client instance
 */
export const createNotteClient = (apiKey?: string, serverUrl?: string): NotteClient => {
    return {
        sessions: createSessionsClient(apiKey, serverUrl),
        agents: createAgentsClient(apiKey, serverUrl),
        env: createEnvClient(apiKey, serverUrl),
    };
};

/**
 * Sets the client to use the local server
 * @param client Notte client
 * @returns Modified client
 */
export const useLocalServer = (client: NotteClient): NotteClient => ({
    sessions: useLocalSessionsServer(client.sessions),
    agents: useLocalAgentsServer(client.agents),
    env: useLocalEnvServer(client.env),
});

/**
 * Sets the client to use the remote server
 * @param client Notte client
 * @returns Modified client
 */
export const useRemoteServer = (client: NotteClient): NotteClient => ({
    sessions: useRemoteSessionsServer(client.sessions),
    agents: useRemoteAgentsServer(client.agents),
    env: useRemoteEnvServer(client.env),
});

// Export individual client functions
export {
    closeSession,
    // Agents
    createAgentsClient,
    // Environment
    createEnvClient,
    // Sessions
    createSessionsClient, getAgentStatus, getEnvironmentStatus, getSessionStatus, listAgents, listSessions, runAgent, startSession, stopAgent, useLocalAgentsServer, useLocalEnvServer, useLocalSessionsServer, useRemoteAgentsServer, useRemoteEnvServer, useRemoteSessionsServer
};

