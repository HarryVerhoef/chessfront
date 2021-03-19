import { lexer, TokenType } from "./parser";

type piece = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type position = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" |
                "b1" | "b2" | "b3" | "b4" | "b5" | "b6" | "b7" | "b8" |
                "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8" |
                "d1" | "d2" | "d3" | "d4" | "d5" | "d6" | "d7" | "d8" |
                "e1" | "e2" | "e3" | "e4" | "e5" | "e6" | "e7" | "e8" |
                "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8" |
                "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8" |
                "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8";
type tile = {
    occupied: boolean,
    occupier: piece | null,
    isWhite: boolean
};

type board = {
    [ key in string ]: tile
};

function isValidMove(board: object, newLoc: string, isWhitesMove: boolean) {
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


function moveHorizontal(board: board, x: number, pieceName: position) {
    // Files: a-h <==> 97-104

    const rank = pieceName[1];
    const initialFileASCII = pieceName[0].charCodeAt(0);
    const newFileASCII = initialFileASCII + x;
    const newLoc = String.fromCharCode(newFileASCII) + rank; 

    if (isValidMove(board, newLoc, true)) {
        board[newLoc] = board[pieceName];
        board[pieceName] = emptyTile;
        
        return board;
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