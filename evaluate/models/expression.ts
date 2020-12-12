namespace models {

    export interface expression {

        eval(env: environment): any;
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
            throw new Error("Method not implemented.");
        }
    }

    export interface binaryExpression extends expression {

    }
}