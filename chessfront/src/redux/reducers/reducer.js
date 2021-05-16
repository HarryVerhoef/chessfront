import parseMove from "../parseMove.ts";
import possibleMoves from "../possibleMoves.ts";
import { startingBoard } from "../presetBoards.js";

const initialTileState = {
    occupied: false,
    occupier: null,
};

const emptyTile = {
    occupied: false,
    occupier: null,
    isWhite: false,
};

const initialState = {
    possibleMoves: [],
    previousMoveStartTile: null,
    previousMoveEndTile: null,
    highlitedTile: null,
    hoverTile: null,
    isDragging: false,
    isWhitesTurn: true,
    whiteKingPos: '',
    blackKingPos: '',
    tiles: {
        a1: initialTileState,
        a2: initialTileState,
        a3: initialTileState,
        a4: initialTileState,
        a5: initialTileState,
        a6: initialTileState,
        a7: initialTileState,
        a8: initialTileState,
        b1: initialTileState,
        b2: initialTileState,
        b3: initialTileState,
        b4: initialTileState,
        b5: initialTileState,
        b6: initialTileState,
        b7: initialTileState,
        b8: initialTileState,
        c1: initialTileState,
        c2: initialTileState,
        c3: initialTileState,
        c4: initialTileState,
        c5: initialTileState,
        c6: initialTileState,
        c7: initialTileState,
        c8: initialTileState,
        d1: initialTileState,
        d2: initialTileState,
        d3: initialTileState,
        d4: initialTileState,
        d5: initialTileState,
        d6: initialTileState,
        d7: initialTileState,
        d8: initialTileState,
        e1: initialTileState,
        e2: initialTileState,
        e3: initialTileState,
        e4: initialTileState,
        e5: initialTileState,
        e6: initialTileState,
        e7: initialTileState,
        e8: initialTileState,
        f1: initialTileState,
        f2: initialTileState,
        f3: initialTileState,
        f4: initialTileState,
        f5: initialTileState,
        f6: initialTileState,
        f7: initialTileState,
        f8: initialTileState,
        g1: initialTileState,
        g2: initialTileState,
        g3: initialTileState,
        g4: initialTileState,
        g5: initialTileState,
        g6: initialTileState,
        g7: initialTileState,
        g8: initialTileState,
        h1: initialTileState,
        h2: initialTileState,
        h3: initialTileState,
        h4: initialTileState,
        h5: initialTileState,
        h6: initialTileState,
        h7: initialTileState,
        h8: initialTileState,
    },
};

export default function appReducer(state = initialState, action) {
    switch(action.type) {
        case "chessfront/resetPiecesToStart": {
            return {
                ...initialState,
                whiteKingPos: 'e1',
                blackKingPos: 'e8',
                tiles: startingBoard.tiles,
            };
        }
        case "chessfront/loadBoard": {
            return {
                ...state,
                tiles: action.payload.board,
            };
        }
        case "chessfront/toggleHighlightTile": {
            let newTilesState = state.tiles;
            const isCurrentlyHighlighted = state.tiles[action.payload.tileName].highlighted;
            newTilesState[action.payload.tileName] = {
                ...newTilesState[action.payload.tileName],
                highlighted: (isCurrentlyHighlighted) ? false : true,
            };
            return {
                ...state,
                tiles: newTilesState,
            };
        }
        case "chessfront/movePiece": {
            console.log(`Making move: ${action.payload.move}`);

            return {
                ...parseMove(state, action.payload.move, state.isWhitesTurn),
                isWhitesTurn: !state.isWhitesTurn,
            };
        }
        case "chessfront/getPossibleMoves": {
            console.log(`Getting possible moves for tile: ${action.payload.tile}`);
            const kingPos = (state.isWhitesTurn) ? state.whiteKingPos : state.blackKingPos;
            const pm = possibleMoves(action.payload.tile, state.tiles, kingPos, state.isWhitesTurn);
            console.log(`Possible moves: ${pm}`);
            return {
                ...state,
                possibleMoves: pm,
            };
        }
        case "chessfront/tileHover": {
            console.log("Activating tile hover classes...");
            return {
                ...state,
                hoverTile: action.payload.tile,
            };
        }
        case "chessfront/dragStart": {
            console.log(action.payload.tileName);
            return {
                ...state,
                isDragging: true,
                dragStartTile: action.payload.tileName,
            };
        }
        case "chessfront/dropPiece": {
            const isKing = (state.tiles[state.dragStartTile].occupier === "king");
            const isWhite = (state.tiles[state.dragStartTile].isWhite);
            if ((state.isWhitesTurn === isWhite) && state.possibleMoves.includes(action.payload.tile)) {
                return {
                    ...state,
                    tiles: {
                        ...state.tiles,
                        [action.payload.tile]: state.tiles[state.dragStartTile],
                        [state.dragStartTile]: emptyTile,
                    },
                    whiteKingPos: (isKing && isWhite) ? action.payload.tile : state.whiteKingPos,
                    blackKingPos: (isKing && !isWhite) ? action.payload.tile : state.blackKingPos,
                    hoverTile: null,
                    isDragging: false,
                    dragStartTile: null,
                    isWhitesTurn: !state.isWhitesTurn,
                };
            }
            return {
                ...state,
                hoverTile: null,
                isDragging: false,
                dragStartTile: null,
            };
        }
        case "chessfront/hidePossibleMoves": {
            console.log("Hiding possible moves in reducer...");
            return {
                ...state,
                possibleMoves: [],
            };
        }
        default:
            return state;
    };
};