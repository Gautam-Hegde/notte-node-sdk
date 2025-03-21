/**
 * Enum for error message modes
 */
export enum ErrorMessageMode {
    DEVELOPER = 'developer',
    USER = 'user',
    AGENT = 'agent',
}

/**
 * Type alias for ErrorMode string union
 */
export type ErrorMode = 'developer' | 'user' | 'agent';

/**
 * Global state for error configuration
 */
let errorMode: ErrorMessageMode = ErrorMessageMode.DEVELOPER;

/**
 * Sets the error message mode for the package
 * @param mode The error message mode to set
 */
export const setErrorMode = (mode: ErrorMode): void => {
    errorMode = mode as ErrorMessageMode;
};

/**
 * Gets the current error message mode
 */
export const getErrorMode = (): ErrorMessageMode => errorMode;

/**
 * Creates a Notte error with proper prototype chain
 * @param name Error name
 * @param message Error message
 */
export const createNotteError = (name: string, message: string): Error => {
    const error = new Error(message);
    error.name = name;
    return error;
};

/**
 * Base error class for Notte SDK
 */
export class NotteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        // Set the prototype explicitly to ensure instanceof works correctly
        Object.setPrototypeOf(this, new.target.prototype);
    }
} 