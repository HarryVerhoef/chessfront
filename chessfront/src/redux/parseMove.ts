import { TokenType, board, position } from './types';
import { lexer } from "./parser";
import possibleMoves from "./possibleMoves";
import possibleAttackers from "./possibleAttackers";


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

    console.log(`is Whites turn: ${isWhite}`);

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
        case equals(tokenStream, [TokenType.File, TokenType.Rank]): { // Simple pawn moves: e4, c5, etc
            const file = lexedMove[0].value + "";
            const rank = parseInt(lexedMove[1].value + "");
            const newPos = file + rank.toString();
            const oneBelow = file + (isWhite ? rank - 1 : rank + 1).toString();
            const twoBelow = file + (isWhite ? rank - 2 : rank + 2).toString();

            if (state.tiles[oneBelow].occupier === "pawn" && state.tiles[oneBelow].isWhite === isWhite) {
                if (possibleMoves(oneBelow, state.tiles).includes(newPos)) {
                    return {
                        ...state,
                        tiles: movePiece(state.tiles, oneBelow, newPos),
                    };
                };
            } else if (state.tiles[twoBelow].occupier === "pawn" && state.tiles[twoBelow].isWhite === isWhite) {
                if (possibleMoves(twoBelow, state.tiles).includes(newPos)) {
                    return {
                        ...state,
                        tiles: movePiece(state.tiles, twoBelow, newPos),
                    };
                };
            };
            return {
                ...state
            };
        }
        case equals(tokenStream, [TokenType.File, TokenType.Captures, TokenType.File, TokenType.Rank]): { // Simple pawn captures: exd5 etc
            const oldFile = lexedMove[0].value + "";
            const newFile = lexedMove[2].value + "";
            const newRank = lexedMove[3].value + "";
            const oldRank = (parseInt(newRank) + (isWhite ? -1 : 1)).toString();
            const oldPosition = oldFile + oldRank;
            const newPosition = newFile + newRank;
            if (state.tiles[newPosition].occupied && state.tiles[newPosition].isWhite !== isWhite) {
                return {
                    ...state,
                    tiles: movePiece(state.tiles, oldPosition, newPosition),
                };
            }
            return {
                ...state,
            };
        }
        case equals(tokenStream, [TokenType.Piece, TokenType.File, TokenType.Rank]): { // Simple non-pawn moves: Nf3, Bc5, etc
            const piece = lexedMove[0].value + "";
            const file = lexedMove[1].value + "";
            const rank = lexedMove[2].value + "";
            const newPos = file + rank;
            if (!state.tiles[newPos].occupied) {
                const possibles = possibleAttackers(state.tiles, piece, newPos, isWhite);
                if (possibles.length === 1) {
                    return {
                        ...state,
                        tiles: movePiece(state.tiles, possibles[0], newPos),
                    };
                };
            };
            return {
                ...state
            };
        }
        case equals(tokenStream, [TokenType.Piece, TokenType.File, TokenType.File, TokenType.Rank]): { // Ambiguous piece moves: Rdf8 etc
            const piece = lexedMove[0].value + "";
            const disambiguatingFile = lexedMove[1].value + "";
            const newFile = lexedMove[2].value + "";
            const newRank = lexedMove[3].value + "";
            const newPos = newFile + newRank;
            if (!state.tiles[newPos].occupied) {
                const possibles = possibleAttackers(state.tiles, piece, newPos, isWhite);
                for (let i = 0; i < possibles.length; i++) {
                    if (possibles[i].charAt(0) === disambiguatingFile) {
                        return {
                            ...state,
                            tiles: movePiece(state.tiles, possibles[i], newPos),
                        };
                    };
                };
            };
            return {
                ...state,
            };
        }
        case equals(tokenStream, [TokenType.Piece, TokenType.Captures, TokenType.File, TokenType.Rank]): { // Simple piece captures: Bxf3 etc
            const piece = lexedMove[0].value + "";
            const file = lexedMove[2].value + "";
            const rank = lexedMove[3].value + "";
            const newPos = file + rank;
            const capturedPiece = state.tiles[newPos];
            if (capturedPiece.occupied && capturedPiece.isWhite !== isWhite) {
                let possibles = possibleAttackers(state.tiles, piece, newPos, isWhite);
                if (possibles.length === 1) {
                    return {
                        ...state,
                        tiles: movePiece(state.tiles, possibles[0], newPos),
                    };
                };
            };
            return {
                ...state
            };
        }
        default:
            console.log(lexedMove);
            throw new Error("Invalid move syntax");
    };
};

export default parseMove;