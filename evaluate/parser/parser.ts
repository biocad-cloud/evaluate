namespace parser {

    export class expression {

        private chars: Pointer<string>;

        constructor(text: string) {
            this.chars = new Pointer<string>(<string[]>Strings.ToCharArray(text, false));
        }

        public getTokens(): token[] {

        }
    }
}