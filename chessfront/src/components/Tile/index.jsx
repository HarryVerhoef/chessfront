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

    const pickUpPiece = () => {
        if (tile.occupied) {
            dispatch({
                type: "chessfront/pickUpPiece",
                payload: {
                    tile: tileName,
                },
            });
        };
    };

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const hidePossibleMoves = () => {
        console.log("Hiding possible moves...");
        dispatch({ type: "chessfront/hidePossibleMoves" });
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

    return (
        <div
            draggable="true"
            className={"tile " + tileClasses.join(" ")}
            onMouseDown={showPossibleMoves}
            onMouseUp={hidePossibleMoves}
            onContextMenu={highlightTile}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {tile.occupied &&
                <Piece pieceType={tile.occupier} isWhite={tile.isWhite} />
            }
        </div>
    )
};

export default Tile;