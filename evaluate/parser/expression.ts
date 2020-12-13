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
                let token: token = this.tryToken($from(this.buffer));

                if (!isNullOrUndefined(bufferNext)) {
                    this.buffer = [bufferNext];
                } else {
                    this.buffer = [];
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

        private static isWhiteSpace(text: string) {
            return text == " " || text == "\t" || text == "\n"
        }

        private tryToken(buffer: IEnumerator<string>): token {
            let textVal: string = buffer.JoinBy("");

            if (buffer.Count == 1) {
                let c: string = buffer.ElementAt(0);

                if (c in operators) {
                    return <token>{ type: "operator", text: c };
                } else if (c in open) {
                    return <token>{ type: "open", text: c };
                } else if (c in close) {
                    return <token>{ type: "close", text: c };
                }
            }

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
            } else if (expression.isWhiteSpace(c)) {
                return this.populateToken(null);
            } else if (this.buffer.length == 1 && (expression.isWhiteSpace(this.buffer[0]) || this.buffer[0] in operators || this.buffer[0] in open || this.buffer[0] in close)) {
                return this.populateToken(c);
            } else {
                this.buffer.push(c);
                return null;
            }
        }
    }
}