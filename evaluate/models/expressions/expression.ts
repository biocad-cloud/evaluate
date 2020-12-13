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
}