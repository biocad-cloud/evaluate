namespace parser {

    export type tokens = "number" | "string" | "keyword" | "operator" | "boolean" | "symbol";

    export interface token {
        type: tokens;
        text: string;
    }
}