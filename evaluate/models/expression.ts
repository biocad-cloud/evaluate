namespace models {

    export abstract class expression {

        abstract eval(env: environment): any;
        abstract toString(): string;
    }

    export class errorExpression extends expression {

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

    export class literalExpression extends expression {

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

    export class functionCallsExpression extends expression {

        constructor(public funcName: string, public parameters: expression[]) {
            super();
        }

        eval(env: environment) {
            let funcSymbol: symbolObject = env.findSymbol(this.funcName);

            if (isNullOrUndefined(funcSymbol)) {
                return <error>{
                    message: `not able to found function symbol '${this.funcName}'!`,
                    code: error_symbolNotFound
                };
            } else {
                let args: any[] = [];
                let value: any;

                for (let a of this.parameters) {
                    value = a.eval(env);
                    args.push(value);
                }

                if (args.length == 0) {
                    return (<Function>funcSymbol.value)();
                } else if (args.length == 1) {
                    return (<Function>funcSymbol.value)(args[0]);
                } else if (args.length == 2) {
                    return (<Function>funcSymbol.value)(args[0], args[1]);
                } else if (args.length == 3) {
                    return (<Function>funcSymbol.value)(args[0], args[1], args[2]);
                } else {
                    return <error>{
                        message: `unsupported!`,
                        code: error_notSupported
                    }
                }
            }
        }

        toString(): string {
            return `${this.funcName}(${$from(this.parameters).Select(p => p.toString()).JoinBy(", ")})`;
        }
    }

    export type operator = "+" | "-" | "*" | "/" | "^" | "%";

    export class binaryExpression extends expression {

        constructor(public left: expression, public bin: operator, public right: expression) {
            super();
        }

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

        toString() {
            return `(${this.left.toString()} ${this.bin} ${this.right.toString()})`;
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