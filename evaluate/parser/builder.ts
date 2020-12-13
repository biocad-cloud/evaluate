namespace parser {

    export function buildExpression(tokens: token[]): models.expression {
        for (let token of tokens) {
            if (token.type == "invalid") {
                return new models.errorExpression(`invalid expression token '${token.text}'`);
            }
        }

        if (tokens.length == 1) {
            return buildSingle(tokens[0]);
        }

        let blocks: token[][] = splitTopLevelStack(tokens, t => t.type == "open" || t.type == "close");
        let tmp: token[] = [];

        for (let block of blocks) {
            for (let token of joinNegative(block)) {
                tmp.push(token);
            }
        }

        blocks = splitTopLevelStack(tmp, t => t.type == "operator");

        if (blocks.length == 1 && blocks[0].length == 1 && blocks[0][0].type == "invalid") {
            return new models.errorExpression(blocks[0][0].text);
        } else if (blocks.length == 1) {
            return buildExpression(blocks[0]);
        } else {
            return buildBinaryTree(blocks);
        }
    }

    function buildSingle(token: token) {
        switch (token.type) {
            case "number": return new models.literalExpression(parseFloat(token.text), token.type);
            case "string": return new models.literalExpression(token.text, token.type);
            case "boolean": return new models.literalExpression(parseBoolean(token.text), token.type);
            case "symbol": return new models.symbolExpression(token.text);

            default:
                return new models.errorExpression(`invalid token ${token.type}::'${token.text}'!`);
        }
    }

    const operatorPriority: string[] = ["^", "*/%", "+-"]

    function joinNegative(tokens: token[]) {
        if (tokens.length >= 2) {
            let startText: string = tokens[0].text;

            if (tokens[0].type == "operator" && (startText == "+" || startText == "-") && tokens[1].type == "number") {
                let number = <token>{
                    type: "number",
                    text: startText == "+" ? tokens[1].text : (-parseFloat(tokens[1].text)).toString()
                }

                let tmp = [number];

                for (let t of $from(tokens).Skip(2).ToArray()) {
                    tmp.push(t);
                }

                return tmp;
            }
        }

        return tokens;
    }

    function joinNegativeBlocks(tokenBlocks: token[][], oplist: string[]) {
        let syntaxResult: models.expression;
        let tokens: token[];
        let buf: builderBuffer[] = [];

        for (let i: number = 0; i < tokenBlocks.length; i++) {
            let block = joinNegative(tokenBlocks[i]);

            if (block.length == 2) {
                syntaxResult = buildSingle(block[0]);
                buf.push(<builderBuffer>{ exp: syntaxResult });
                buf.push(<builderBuffer>{ op: block[1].text });
            } else if (block.length == 1) {
                syntaxResult = buildExpression(block);
                buf.push(<builderBuffer>{ exp: syntaxResult });
            } else {
                tokens = $from(block).Skip(1).Take(block.length - 3).ToArray();
                syntaxResult = buildExpression(tokens);
                buf.push(<builderBuffer>{ exp: syntaxResult });
                buf.push(<builderBuffer>{ op: block[block.length - 1].text });
            }
        }

        return buf;
    }

    interface builderBuffer {
        exp: models.expression;
        op: string;
    }

    function buildBinaryTree(blocks: token[][]): models.expression {
        let oplist: string[] = [];
        let buf: builderBuffer[] = joinNegativeBlocks(blocks, oplist);

        if (buf.length == 1) {
            if (!isNullOrUndefined(buf[0].exp)) {
                return buf[0].exp;
            } else {
                return new models.errorExpression(`invalid token '${buf[0].op}'!`);
            }
        }

        console.log(buf);
    }

    function splitTopLevelStack(tokens: token[], isDeli: TestDelimiter) {
        if (tokens.length == 1) {
            return [tokens];
        } else {
            return splitTopLevelStackInternal(tokens, isDeli);
        }
    }

    interface TestDelimiter { (token: token): boolean; }

    function splitTopLevelStackInternal(tokens: token[], isDeli: TestDelimiter) {
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

            if (isDeli(token)) {
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