import { TokenType, Token } from './types';

function constructToken(tokenType: TokenType, value?: string): Token {
    return {
        tokenType: tokenType,
        value: value,
    };
};


export function lexer(move: string): Token[] {
    const charArray: string[] = [...move];
    console.log(charArray);
    let res: Token[] = [];
    let identStr: string = "";
    for (let i: number = 0; i < charArray.length; i++) {
        switch(charArray[i]) {
            case "a":
            case "b":
            case "c":
            case "d":
            case "e": {
                if (charArray.length > i + 1 && charArray[i] === ".") {
                    identStr += "e";
                    continue;
                }
            }
            case "f":
            case "g":
            case "h": {
                res.push(constructToken(TokenType.File, charArray[i]));
                continue;
            }
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8": {
                res.push(constructToken(TokenType.Rank, charArray[i]));
                continue;
            }
            case "K":
            case "Q":
            case "R":
            case "B":
            case "N": {
                res.push(constructToken(TokenType.Piece, charArray[i]));
                continue;
            }
            case "x": {
                res.push(constructToken(TokenType.Captures));
                continue;
            }
            case "p":
            case ".": {
                if (identStr === "e.p.") {
                    res.push(constructToken(TokenType.EnPassant));
                    identStr = "";
                    continue;
                }
                identStr += charArray[i];
                continue;
            }
            case "0":
            case "-": {
                identStr += charArray[i];
                console.log(`Reached castle cases, char: ${charArray[i]}, identStr: ${identStr}`);
                if (identStr === "0-0") {
                    if (charArray.length === 3) {
                        console.log("Lexer resulted in queensidecastle");
                        res.push(constructToken(TokenType.QueenSideCastle));
                        identStr = "";
                    }
                    
                } else if (identStr === "0-0-0") {
                    res.push(constructToken(TokenType.KingSideCastle));
                    identStr = "";
                };
                continue;
            }
            case "+": {
                res.push(constructToken(TokenType.Check));
                continue;
            }
            case "#": {
                res.push(constructToken(TokenType.Checkmate));
                continue;
            }
            default: {
                res.push(constructToken(TokenType.Invalid, charArray[i]));
            }
        }
    }
    return res;
};