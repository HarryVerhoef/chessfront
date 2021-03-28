import { TokenType, board, position } from './types';
import { lexer } from "./parser";
import possibleMoves from "./possibleMoves";


const emptyTile = {
    occupied: false,
    occupier: null,
    isWhite: false,
};

const movePiece = (brd: board, initialPos: string, newPos: string): board => {
    const newBoard = { ...brd };
    newBoard[initialPos] = emptyTile;
    newBoard[newPos] = brd[initialPos]
    return newBoard;
};

function moveHorizontal(brd: board, x: number, pieceName: position) {
    // Files: a-h <==> 97-104

    const rank = pieceName[1];
    const initialFileASCII = pieceName[0].charCodeAt(0);
    const newFileASCII = initialFileASCII + x;
    const newLoc = String.fromCharCode(newFileASCII) + rank; 

    brd[newLoc] = brd[pieceName];
    brd[pieceName] = emptyTile;
    
    return brd;
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
            const file = lexedMove[0].value + "";
            const rank = parseInt(lexedMove[1].value + "");
            const newPos = file + rank.toString();
            const oneBelow = file + (rank - 1).toString();
            const twoBelow = file + (rank - 2).toString();

            if (state.tiles[oneBelow].occupier === "pawn" && possibleMoves(oneBelow, state.tiles).includes(newPos)) {
                return {
                    ...state,
                    tiles: movePiece(state.tiles, oneBelow, newPos),
                };
            } else if (state.tiles[twoBelow].occupier === "pawn" && possibleMoves(twoBelow, state.tiles).includes(newPos)) {
                return {
                    ...state,
                    tiles: movePiece(state.tiles, twoBelow, newPos),
                };
            };
            return {
                ...state
            };
        }
        default: {
            console.log(lexedMove);
            throw new Error("Invalid move syntax");
        }
    };
};

export default parseMove;