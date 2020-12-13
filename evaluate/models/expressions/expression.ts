namespace models {

    export abstract class expression {

        abstract get class(): expressionClass;

        abstract eval(env: environment): any;
        abstract toString(): string;
    }

    export type expressionClass = "error" | "literal" | "symbol" | "binary" | "function";

    export class errorExpression extends expression {

        get class(): expressionClass {
            return "error";
        }

        constructor(public message: string) {
            super();
        }

        eval(env: environment) {
            return <error>{ message: this.message };
        }

        toString() {
            return `[ERROR] ${this.message}`
        }
    }
}