import {
    closeSession,
    createNotteClient,
    getAgentStatus,
    getEnvironmentStatus,
    getSessionStatus,
    runAgent,
    startSession
} from '../src';

const main = async () => {
    try {
        console.log('Creating Notte client...');
        let notte = createNotteClient();

        // Check environment status
        console.log('Checking environment status...');
        const envStatus = await getEnvironmentStatus(notte.env);
        console.log('Environment status:', envStatus);

        // Start a session
        console.log('Starting a new session...');
        const updatedSessionsClient = await startSession(notte.sessions, {
            timeout_minutes: 5,
            screenshot: true,
            max_steps: 20
        });

        // Update the client with the new sessions client
        notte = {
            ...notte,
            sessions: updatedSessionsClient
        };

        const sessionId = notte.sessions.lastSessionResponse?.id;
        console.log(`Started session: ${sessionId}`);

        // Get session status
        console.log('Getting session status...');
        const updatedSessionsClientWithStatus = await getSessionStatus(notte.sessions);

        // Update the client with the new sessions client
        notte = {
            ...notte,
            sessions: updatedSessionsClientWithStatus
        };

        console.log(`Session status: ${notte.sessions.lastSessionResponse?.status}`);

        // Run an agent
        console.log('Running an agent...');
        const updatedAgentsClient = await runAgent(notte.agents, {
            session_id: sessionId!,
            agent_config: {
                type: 'browser',
                parameters: {
                    url: 'https://example.com',
                },
            },
            max_actions: 100
        });

        // Update the client with the new agents client
        notte = {
            ...notte,
            agents: updatedAgentsClient
        };

        const agentId = notte.agents.lastAgentResponse?.id;
        console.log(`Started agent: ${agentId}`);

        // Get agent status
        console.log('Getting agent status...');
        const status = await getAgentStatus(notte.agents);
        console.log(`Agent status: ${status.status}`);

        // Close the session (clean up)
        console.log('Closing session...');
        const updatedSessionsClientAfterClose = await closeSession(notte.sessions);

        // Update the client with the new sessions client
        notte = {
            ...notte,
            sessions: updatedSessionsClientAfterClose
        };

        console.log('Session closed');

    } catch (error) {
        console.error('Error:', error.message);
        if ((error as any).name === 'NotteAPIError') {
            console.error('Status code:', (error as any).statusCode);
            console.error('Response:', (error as any).response);
        }
    }
};

// Run the example
main().catch(console.error); 