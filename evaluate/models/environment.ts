namespace models {

    export class environment {

        readonly symbols = new Dictionary<symbolObject>();

        findSymbol(symbolName: string): symbolObject {
            if (this.symbols.ContainsKey(symbolName)) {
                return this.symbols.Item(symbolName);
            } else {
                return null;
            }
        }
    }
}