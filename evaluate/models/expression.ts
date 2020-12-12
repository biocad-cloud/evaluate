namespace models {

    export interface expression {

        eval(env: environment): any;
    }

    export class errorExpression implements expression {

        constructor(public message: string) { }

        eval(env: environment) {
            return <error>{ message: this.message };
        }
    }

    export class literalExpression implements expression {

        constructor(public value: number | boolean | string) { };

        eval(env: environment) {
            return this.value;
        }
    }

    export class symbolExpression implements expression {

        constructor(public symbolName: string) { }

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
    }

    export type operator = "+" | "-" | "*" | "/" | "^" | "%";

    export class binaryExpression implements expression {

        constructor(public left: expression, public bin: operator, public right: expression) { }

        eval(env: environment) {
            let left = this.left.eval(env);
            let right = this.right.eval(env);

            switch (this.bin) {
                case "+": return this.add(left, right, env);
                case "-": return this.minus(left, right, env);
                case "*": return this.times(left, right, env);
                case "/": return this.divid(left, right, env);
                case "^": return this.power(left, right, env);
                case "%": return this.module(left, right, env);

                default:
                    return <error>{
                        message: `unknown binary operator '${this.bin}'!`
                    }
            }
        }

        private add(x, y, env: environment) {
            return x + y;
        }

        private minus(x, y, env: environment) {
            return x * y;
        }

        private times(x, y, env: environment) {
            return x * y;
        }

        private divid(x, y, env: environment) {
            return x / y;
        }

        private power(x, y, env: environment) {
            return Math.pow(x, y);
        }

        private module(x, y, env: environment) {
            return x % y;
        }
    }
}