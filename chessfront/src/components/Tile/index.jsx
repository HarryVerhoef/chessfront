import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Tile.css';
import Piece from '../Piece';

const Tile = ({ rowNo, colNo }) => {
    const colChar = String.fromCharCode(96 + colNo); // a=97 in ASCII
    const tileName = colChar + rowNo.toString();
    const tile = useSelector(state => state.tiles[tileName]);
    const board = useSelector(state => state);
    const dispatch = useDispatch();
    let tileClasses = [(rowNo & 1) === (colNo & 1) ? "dark" : "light"];
    let pieceClasses = [];
    
    useEffect(() => {
        dispatch({ type: "chessfront/resetPiecesToStart" });
    }, [dispatch]);

    if (tile.occupied) {
        pieceClasses.push(`${tile.occupier}-${(tile.isWhite) ? "white" : "black"}`);
    }
    if (tile.highlighted) {
        tileClasses.push("tile-highlighted");
    };

    if (board.possibleMoves.includes(tileName)) {
        tileClasses.push("isPossibleMove");
    };
    if (board.hoverTile === tileName) {
        tileClasses.push("is-dragging-over");
    }

    const showPossibleMoves = () => {
        console.log("Showing possible moves...");
        if (tile.occupied) {
            dispatch({
                type: "chessfront/getPossibleMoves",
                payload: {
                    tile: tileName,
                },
            });
        };
    };

    const handleDragEnter = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({
            type: "chessfront/tileHover",
            payload: {
                tile: tileName,
            },
        });
        console.log("handleDragEnter");
    };

    const cancelDragOver = e => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleDrop = e => {
        e.stopPropagation();
        e.preventDefault();
        hidePossibleMoves();
        dispatch({
            type: "chessfront/dropPiece",
            payload: {
                tile: tileName,
            },
        });
        dispatch({ type: "chessfront/hidePossibleMoves" });
        console.log("handleDrop");
    };

    const hidePossibleMoves = () => {
        if (!board.hoverTile) {
            console.log("Hiding possible moves...");
            dispatch({ type: "chessfront/hidePossibleMoves" });
        }
    };

    const highlightTile = (e) => {
        dispatch({
            type: "chessfront/toggleHighlightTile",
            payload: {
                tileName: tileName,
            },
        });
        e.preventDefault();
    };

    const handleDragStart = () => {
        console.log(`Drag started on tile: ${tileName}`);
        dispatch({
            type: "chessfront/dragStart",
            payload: {
                tileName: tileName,
            },
        });
    };

    return (
        <div
            className={"tile " + tileClasses.join(" ")}
            onMouseDown={showPossibleMoves}
            onMouseUp={hidePossibleMoves}
            onContextMenu={highlightTile}
            onDragOver={cancelDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
        >
            {tile.occupied &&
                <Piece pieceType={tile.occupier} isWhite={tile.isWhite} onDragStart={handleDragStart} />
            }
        </div>
    )
};

export default Tile;