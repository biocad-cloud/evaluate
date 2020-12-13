namespace models {

    export class environment {

        readonly symbols = new Dictionary<symbolObject>();
        readonly functions = new Dictionary<symbolObject>();

        constructor() {
            this.functions.Add("floor", <symbolObject>{ name: "floor", value: Math.floor, type: "function", readonly: true });
        }

        findFunction(symbolName: string): symbolObject {
            if (this.functions.ContainsKey(symbolName)) {
                return this.symbols.Item(symbolName);
            } else {
                return null;
            }
        }

        findSymbol(symbolName: string): symbolObject {
            if (this.symbols.ContainsKey(symbolName)) {
                return this.symbols.Item(symbolName);
            } else {
                return null;
            }
        }

        hasSymbol(symbolName: string): boolean {
            return this.symbols.ContainsKey(symbolName);
        }

        addSymbol(symbolName: string, value: any, type: string, readonly: boolean): error {
            let symbol = <symbolObject>{
                name: symbolName,
                value: value,
                type: type,
                readonly: readonly
            };

            if (this.hasSymbol(symbolName)) {
                return <error>{
                    message: `symbol object '${symbolName}' is already exists in current environment!`,
                    code: error_symbolConflicts
                }
            } else {
                this.symbols.Add(symbolName, symbol);
                return null;
            }
        }

        setSymbol(symbolName: string, value: any): error {
            if (this.hasSymbol(symbolName)) {
                let symbol = this.findSymbol(symbolName);

                if (symbol.readonly) {
                    return <error>{
                        message: `target symbol '${symbolName}' is readonly!`,
                        code: error_symbolReadOnly
                    }
                } else {
                    symbol.value = value;
                }
            } else {
                return <error>{
                    message: `symbol object '${symbolName}' can not be found in current environment!`,
                    code: error_symbolNotFound
                }
            }

            return null;
        }
    }
}