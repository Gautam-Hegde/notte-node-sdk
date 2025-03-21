import { createNotteError } from './base';

/**
 * Creates an authentication error
 * @param message Error message
 */
export const createAuthenticationError = (
    message: string = 'Authentication failed. Please check your API key.'
): Error => createNotteError('AuthenticationError', message);

/**
 * Type for API Error response
 */
export interface ApiErrorResponse {
    statusCode?: number;
    response?: unknown;
}

/**
 * Creates an API error with status code and response
 * @param message Error message
 * @param statusCode HTTP status code
 * @param response Raw response data
 */
export const createNotteAPIError = (
    message: string,
    statusCode?: number,
    response?: unknown
): Error & ApiErrorResponse => {
    const error = createNotteError('NotteAPIError', message) as Error & ApiErrorResponse;
    error.statusCode = statusCode;
    error.response = response;
    return error;
};

/**
 * Creates an invalid request error
 * @param message Error message
 */
export const createInvalidRequestError = (
    message: string = 'Invalid request parameters.'
): Error => createNotteError('InvalidRequestError', message);

/**
 * Creates a not found error
 * @param message Error message
 */
export const createNotFoundError = (
    message: string = 'Resource not found.'
): Error & ApiErrorResponse => createNotteAPIError(message, 404);

/**
 * Creates a timeout error
 * @param message Error message
 */
export const createTimeoutError = (
    message: string = 'Request timed out.'
): Error & ApiErrorResponse => createNotteAPIError(message, 408); 