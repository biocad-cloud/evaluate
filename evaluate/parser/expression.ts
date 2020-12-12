namespace parser {

    export class expression {

        private chars: Pointer<string>;
        private buffer: string[] = [];

        constructor(text: string) {
            this.chars = new Pointer<string>(<string[]>Strings.ToCharArray(text, false));
        }

        public getTokens(): token[] {
            let result: token[] = [];
            let tmp: token = null;

            while (!this.chars.EndRead) {
                if (!isNullOrUndefined(tmp = this.walkChar(this.chars.Next))) {
                    result.push(tmp);
                }
            }

            tmp = this.populateToken(null);

            if (!isNullOrUndefined(tmp)) {
                result.push(tmp);
            }

            return result;
        }

        private populateToken(bufferNext: string): token {
            if (this.buffer.length == 0) {
                if (!isNullOrUndefined(bufferNext)) {
                    this.buffer = [bufferNext];
                }

                return null;
            } else {
                let token: token = this.tryToken();

                if (!isNullOrUndefined(bufferNext)) {
                    this.buffer = [bufferNext];
                }

                return token;
            }
        }

        private static isStringLiteral(buffer: string[]): boolean {
            if (buffer.length < 2) {
                return false;
            } else {
                return false;
            }
        }

        private static isBooleanLiteral(text: string): boolean {
            return false;
        }

        private tryToken(): token {
            let buffer = $from(this.buffer);
            let textVal: string = buffer.JoinBy("");

            if (expression.isStringLiteral(this.buffer)) {
                return <token>{ type: "string", text: textVal };
            } else if (buffer.All(Strings.isNumber)) {
                return <token>{ type: "number", text: textVal };
            } else if (expression.isBooleanLiteral(textVal)) {
                return <token>{ type: "boolean", text: textVal };
            } else if (buffer.All(c => c == "_" || Strings.isAlphabet(c))) {
                return <token>{ type: "symbol", text: textVal };
            } else {
                return <token>{ type: "invalid", text: textVal };
            }
        }

        private walkChar(c: string): token {
            if (c == "+" || c == "-" || c == "*" || c == "/" || c == "^" || c == "%") {
                return this.populateToken(c);
            } else if (c == "(" || c == ")" || c == "[" || c == "]" || c == "{" || c == "}") {
                return this.populateToken(c);
            }
        }
    }
}