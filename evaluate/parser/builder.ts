namespace parser {

    export function buildExpression(tokens: token[]): models.expression {
        console.table(tokens);

        for (let token of tokens) {
            if (token.type == "invalid") {
                return new models.errorExpression(`invalid expression token '${token.text}'`);
            }
        }

        let blocks: token[][] = splitTopLevelStack(tokens);

        if (blocks.length == 1 && blocks[0].length == 1 && blocks[0][0].type == "invalid") {
            return new models.errorExpression(blocks[0][0].text);
        }

        console.log(blocks);

        for (let block of blocks) {

        }
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