namespace parser {

    export type tokens = "invalid" | "number" | "string" | "keyword" | "operator" | "boolean" | "symbol" | "open" | "close";

    export interface token {
        type: tokens;
        text: string;
    }
}