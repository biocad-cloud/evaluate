namespace parser {

    export function buildExpression(tokens: token[]): models.expression {
        for (let token of tokens) {
            if (token.type == "invalid") {
                return new models.errorExpression(`invalid expression token '${token.text}'`);
            }
        }

        console.table(tokens);
    }
}