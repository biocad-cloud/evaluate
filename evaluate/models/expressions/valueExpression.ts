/// <reference path="expression.ts" />

namespace models {

    export class literalExpression extends expression {

        get class(): expressionClass {
            return "literal";
        }

        constructor(public value: number | boolean | string, public type: parser.tokens) {
            super();
        };

        eval(env: environment) {
            return this.value;
        }

        toString() {
            return `<${this.type}>${this.value.toString()}`;
        }
    }

    export class symbolExpression extends expression {

        get class(): expressionClass {
            return "symbol";
        }

        constructor(public symbolName: string) {
            super();
        }

        eval(env: environment) {
            let symbol = env.findSymbol(this.symbolName);

            if (isNullOrUndefined(symbol)) {
                return <error>{
                    message: `not able to found symbol '${this.symbolName}'!`,
                    code: error_symbolNotFound
                };
            } else {
                return symbol.value;
            }
        }

        toString() {
            return `&${this.symbolName}`;
        }
    }
}