/// <reference path="expression.ts" />

namespace models {

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