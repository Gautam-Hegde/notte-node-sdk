import { z } from 'zod';

// Constants
export const DEFAULT_OPERATION_SESSION_TIMEOUT_IN_MINUTES = 3;
export const DEFAULT_GLOBAL_SESSION_TIMEOUT_IN_MINUTES = 30;
export const DEFAULT_MAX_NB_ACTIONS = 100;
export const DEFAULT_MAX_NB_STEPS = 20;

// Session Management

export const SessionStartRequestSchema = z.object({
    timeout_minutes: z
        .number()
        .int()
        .gt(0)
        .max(DEFAULT_GLOBAL_SESSION_TIMEOUT_IN_MINUTES)
        .default(DEFAULT_OPERATION_SESSION_TIMEOUT_IN_MINUTES)
        .describe('Session timeout in minutes. Cannot exceed the global timeout.'),
    screenshot: z
        .boolean()
        .nullable()
        .optional()
        .describe('Whether to include a screenshot in the response.'),
    max_steps: z
        .number()
        .int()
        .gt(0)
        .optional()
        .default(DEFAULT_MAX_NB_STEPS)
        .describe('Maximum number of steps in the trajectory. An error will be raised if this limit is reached.'),
    proxies: z
        .array(z.string())
        .nullable()
        .optional()
        .describe('List of proxies to use for the session. If not provided, the default proxies will be used.'),
});

export type SessionStartRequest = z.infer<typeof SessionStartRequestSchema>;

export const SessionRequestSchema = SessionStartRequestSchema.extend({
    session_id: z
        .string()
        .nullable()
        .optional()
        .describe('The ID of the session. A new session is created when not provided.'),
    keep_alive: z
        .boolean()
        .default(false)
        .describe('If true, the session will not be closed after the operation is completed.'),
});

export type SessionRequest = z.infer<typeof SessionRequestSchema>;

export const SessionListRequestSchema = z.object({
    only_active: z.boolean().default(true),
    limit: z.number().int().default(10),
});

export type SessionListRequest = z.infer<typeof SessionListRequestSchema>;

// Response Types

export interface SessionResponse {
    id: string;
    status: string;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    data?: Record<string, unknown>;
}

// Agent Types

export const AgentRunRequestSchema = z.object({
    session_id: z.string().describe('The ID of the session to run the agent on.'),
    agent_config: z.record(z.unknown()).describe('The agent configuration.'),
    max_actions: z
        .number()
        .int()
        .default(DEFAULT_MAX_NB_ACTIONS)
        .describe('Maximum number of actions the agent can perform.'),
});

export type AgentRunRequest = z.infer<typeof AgentRunRequestSchema>;

export const AgentListRequestSchema = z.object({
    only_active: z.boolean().default(true),
    limit: z.number().int().default(10),
});

export type AgentListRequest = z.infer<typeof AgentListRequestSchema>;

export interface AgentResponse {
    id: string;
    session_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    data?: Record<string, unknown>;
}

export interface AgentStatusResponse<T = Record<string, unknown>> {
    id: string;
    session_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    output?: T;
} 