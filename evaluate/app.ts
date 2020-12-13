/// <reference path="../../build/linq.d.ts" />

/// <reference path="models/expressions/expression.ts" />

function parseExpression(text: string): models.expression {
    let tokens = new parser.expression(text).getTokens();
    let result: models.expression = parser.buildExpression(tokens);

    // TypeScript.logging.log(`the input raw expression: ${text}`, TypeScript.ConsoleColors.Magenta);
    // TypeScript.logging.log(`the result expression: ${result.toString()}`, TypeScript.ConsoleColors.DarkCyan);
    // TypeScript.logging.log(result);

    return result;
}

function environment(symbols: {} = {}) {
    let env = new models.environment();

    for (let name in symbols) {
        env.addSymbol(name, symbols[name], "any", false);
    }

    return env;
}