## Notte SDK for Node.js

A Node.js SDK for the Notte API, mirroring the functionality of the Python SDK.
This SDK is mirrored from the official implementation by [Notte Labs](https://github.com/nottelabs/notte)

## Installation
Not published.
```bash
npm install notte-sdk
```

## Usage

### Authentication

```typescript
import { createNotteClient } from 'notte-sdk';

// Use API key from NOTTE_API_KEY environment variable
const notte = createNotteClient();

// Or provide API key directly
const notte = createNotteClient('your-api-key');
```

### Sessions

```typescript
import { createNotteClient, startSession, closeSession, getSessionStatus } from 'notte-sdk';

const main = async () => {
  // Create a client
  let notte = createNotteClient();
  
  // Start a new session
  notte = await startSession(notte.sessions, {
    timeout_minutes: 5,
    screenshot: true,
  });
  
  const sessionId = notte.sessions.lastSessionResponse?.id;
  console.log(`Started session: ${sessionId}`);
  
  // Get session status
  notte = await getSessionStatus(notte.sessions);
  console.log(`Session status: ${notte.sessions.lastSessionResponse?.status}`);
  
  // Close the session
  notte = await closeSession(notte.sessions);
  console.log('Session closed');
};

main().catch(console.error);
```

### Agents

```typescript
import { createNotteClient, startSession, runAgent, getAgentStatus } from 'notte-sdk';

const main = async () => {
  // Create a client
  let notte = createNotteClient();
  
  // Start a new session
  notte = await startSession(notte.sessions, {
    timeout_minutes: 5,
  });
  
  const sessionId = notte.sessions.lastSessionResponse?.id;
  
  // Run an agent
  notte = await runAgent(notte.agents, {
    session_id: sessionId!,
    agent_config: {
      type: 'browser',
      parameters: {
        url: 'https://example.com',
      },
    },
  });
  
  const agentId = notte.agents.lastAgentResponse?.id;
  console.log(`Started agent: ${agentId}`);
  
  // Get agent status
  const status = await getAgentStatus(notte.agents);
  console.log(`Agent status: ${status.status}`);
};

main().catch(console.error);
```

### Environment

```typescript
import { createNotteClient, getEnvironmentStatus } from 'notte-sdk';

const main = async () => {
  const notte = createNotteClient();
  
  // Get environment status
  const status = await getEnvironmentStatus(notte.env);
  console.log('Environment status:', status);
};

main().catch(console.error);
```

### Local Development

To use a local server:

```typescript
import { createNotteClient, useLocalServer } from 'notte-sdk';

const notte = createNotteClient();
const localNotte = useLocalServer(notte);
```

## Error Handling

```typescript
import { setErrorMode, ErrorMessageMode } from 'notte-sdk';

// Set error mode for better error messages
setErrorMode(ErrorMessageMode.DEVELOPER);

try {
  // SDK operations
} catch (error) {
  console.error('Error:', error.message);
  
  // For API errors
  if (error.name === 'NotteAPIError') {
    console.error('Status code:', error.statusCode);
    console.error('Response:', error.response);
  }
}
```
