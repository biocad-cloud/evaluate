namespace parser {

    export function buildExpression(tokens: token[]): models.expression {
        for (let token of tokens) {
            if (token.type == "invalid") {
                return new models.errorExpression(`invalid expression token '${token.text}'`);
            }
        }

        if (tokens.length == 0) {
            return buildSingle(tokens[0]);
        }

        let blocks: token[][] = splitTopLevelStack(tokens);

        if (blocks.length == 1 && blocks[0].length == 1 && blocks[0][0].type == "invalid") {
            return new models.errorExpression(blocks[0][0].text);
        }

        console.log(blocks);

        for (let block of blocks) {

        }
    }

    function buildSingle(token: token) {
        switch (token.type) {
            case "number": return new models.literalExpression(parseFloat(token.text), token.type);
            case "string": return new models.literalExpression(token.text, token.type);
            case "operator": return new models.errorExpression(`invalid token ${token.type}::'${token.text}'!`);
            case "boolean": return new models.literalExpression(parseBoolean(token.text), token.type);
        }
    }

    function buildBinaryTree(blocks: token[][]) {

    }

    function splitTopLevelStack(tokens: token[]) {
        if (tokens.length == 1) {
            return [tokens];
        } else {
            return splitTopLevelStackInternal(tokens);
        }
    }

    function splitTopLevelStackInternal(tokens: token[]) {
        let blocks: token[][] = [];
        let openStack: string[] = [];
        let buf: token[] = [];

        for (let token of tokens) {
            let add = true;

            if (token.type == "open") {
                if (openStack.length == 0 && buf.length > 0) {
                    blocks.push([...buf]);
                    buf = [token];
                    add = false;
                }

                openStack.push(token.text);
            } else if (token.type == "close") {
                if (openStack.length == 0) {
                    return [
                        [<token>{
                            type: "invalid",
                            text: `invalid syntax nearby '${$from(tokens).Select(a => a.text).JoinBy(" ")}'!`
                        }]
                    ]
                } else {
                    openStack.pop();
                }
            }

            if (token.type == "open" || token.type == "close") {
                if (openStack.length == 0) {
                    // is top level
                    if (buf.length > 0) {
                        buf.push(token);
                        blocks.push([...buf]);
                        buf = [];
                    } else {
                        blocks.push([token]);
                    }

                    add = false;
                }
            }

            if (add) {
                buf.push(token);
            }
        }

        if (buf.length > 0) {
            blocks.push(buf);
        }

        return blocks;
    }
}