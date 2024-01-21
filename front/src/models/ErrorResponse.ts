
export enum ErrorType {
    VALIDATION = 'Erreur de validation',
    BODY = 'Erreur de contenu',
    FAILURE = 'Critique',
    NOT_FOUND = 'Introuvable',
    DENIED = 'Accès interdit'
}

export const NetFailureBody =  { message: ErrorType.FAILURE, data: "Erreur réseau" }

export default interface NetErrorBody {
    message: ErrorType,
    data: string
}