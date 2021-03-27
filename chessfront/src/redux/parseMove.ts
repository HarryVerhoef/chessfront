import { TokenType, board, position } from './types';
import { lexer } from "./parser";

function isValidMove(brd: object, newLoc: string, isWhitesMove: boolean) {
    /*
    ** (1) Check new location is between files a and h
    ** (2) Check new location is between ranks 1 and 8
    ** (3) Check move does not concede a check
    */

    const newFileASCII = newLoc[0].charCodeAt(0);
    const newRank = parseInt(newLoc[1]);
    console.log(`New location: ${newLoc}`);

    if (newFileASCII < 97 || newFileASCII > 104) {
        throw new Error("Invalid horizontal location: file out of bounds");
    } else if (newRank < 1 || newRank > 8) {
        throw new Error("Invalid vertical location: rank out of bounds");
    };

    return true;
};


const emptyTile = {
    occupied: false,
    occupier: null,
    isWhite: false,
};


function moveHorizontal(brd: board, x: number, pieceName: position) {
    // Files: a-h <==> 97-104

    const rank = pieceName[1];
    const initialFileASCII = pieceName[0].charCodeAt(0);
    const newFileASCII = initialFileASCII + x;
    const newLoc = String.fromCharCode(newFileASCII) + rank; 

    if (isValidMove(brd, newLoc, true)) {
        brd[newLoc] = brd[pieceName];
        brd[pieceName] = emptyTile;
        
        return brd;
    };
    return {};
};

function equals(stream: TokenType[], syntax: TokenType[]): boolean {
    if (stream.length !== syntax.length) {
        return false;
    }
    for (let i: number = 0; i < stream.length; i++) {
        if (stream[i] !== syntax[i]) {
            return false;
        };
    };
    return true;
};

function parseMove(state: any, move: string, isWhite: boolean) {

    console.log(`Parsing Move: ${move}`);

    const lexedMove = lexer(move);
    const tokenStream = lexedMove.map(({ tokenType }) => tokenType);

    switch(true) {
        case equals(tokenStream, [TokenType.QueenSideCastle]): {
            const kingLoc = isWhite ? "e1" : "e8";
            const rookLoc = isWhite ? "h1" : "h8";
            state.tiles = moveHorizontal(state.tiles, 2, kingLoc);
            return {
                ...state,
                tiles: moveHorizontal(state.tiles, -2, rookLoc),
            };
        }
        case equals(tokenStream, [TokenType.KingSideCastle]): {
            const kingLoc = isWhite ? "e1" : "e8";
            const rookLoc = isWhite ? "a1" : "a8";
            state.tiles = moveHorizontal(state.tiles, -2, kingLoc);
            return {
                ...state,
                tiles: moveHorizontal(state.tiles, 3, rookLoc),
            };
        }
        case equals(tokenStream, [TokenType.File, TokenType.Rank]): {
            // pawn on file f advances to rank r
            const file = lexedMove[0].value;
            


        }
        default: {
            console.log(lexedMove);
            throw new Error("Invalid move syntax");
        }
    };
};

export default parseMove;