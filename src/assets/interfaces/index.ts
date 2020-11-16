export type JSTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
export type Primitives =  string | number | boolean | Date;

export interface ContextResponse {
    status: number;
    headers: Record<string, Primitives>;
    body: unknown;
}

export interface ErrorResponse {
    context: unknown;
    errors: ErrorResponseBody[];
}

export interface ErrorResponseBody {
    name: string;
    message: string;
    stack: string;
}