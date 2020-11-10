export type Primitives =  string | number | boolean | Date;

export interface ContextResponse {
    status: number;
    headers: Record<string, Primitives>;
    body: unknown;
}

export interface ResponseError {
    context: unknown;
    errors: ResponseErrorBody[];
}

export interface ResponseErrorBody {
    name: string;
    message: string;
    stack: string;
}