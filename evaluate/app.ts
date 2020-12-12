/// <reference path="../../build/linq.d.ts" />

function parseExpression(text: string): models.expression {
    let tokens = new parser.expression(text).getTokens();
    let result: models.expression = parser.buildExpression(tokens);

    return result;
}