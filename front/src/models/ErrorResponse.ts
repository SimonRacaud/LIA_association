
export enum ErrorType {
    VALIDATION = 'Validation Error',
    BODY = 'Body Error',
    FAILURE = 'Failure',
    NOT_FOUND = 'Not found',
    DENIED = 'Access denied'
}

export const NetFailureBody =  { message: ErrorType.FAILURE, data: "Erreur réseau" }

export default interface NetErrorBody {
    message: ErrorType,
    data: string
}