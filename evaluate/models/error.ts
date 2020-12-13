namespace models {

    export interface error {
        message: string;
        code: number;
    }

    export const error_invalidToken = 110;
    export const error_invalidSyntax = 120;
    export const error_symbolNotFound = 404;
    export const error_symbolReadOnly = 403;
    export const error_symbolConflicts = 401;
    export const error_notSupported = 405;

}