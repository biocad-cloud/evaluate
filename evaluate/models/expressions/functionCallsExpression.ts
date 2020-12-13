/// <reference path="expression.ts" />

namespace models {

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
}