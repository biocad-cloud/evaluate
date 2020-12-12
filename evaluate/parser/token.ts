namespace parser {

    export type tokens = "invalid" | "number" | "string" | "keyword" | "operator" | "boolean" | "symbol" | "open" | "close";

    export interface token {
        type: tokens;
        text: string;
    }

    export const operators = { "+": true, "-": true, "*": true, "/": true, "^": true, "%": true };
    export const open = { "(": true, "{": true, "[": true };
    export const close = { ")": true, "}": true, "]": true };

}