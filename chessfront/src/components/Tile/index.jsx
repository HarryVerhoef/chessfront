import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Tile.css';

const Tile = ({ rowNo, colNo }) => {
    const dispatch = useDispatch();
    let tileClasses = [(rowNo & 1) === (colNo & 1) ? "dark" : "light"];
    let pieceClasses = [];
    
    useEffect(() => {
        dispatch({ type: "chessfront/resetPiecesToStart" });
    }, [dispatch]);

    const colChar = String.fromCharCode(96 + colNo); // a=97 in ASCII
    const tileName = colChar + rowNo.toString();

    const tile = useSelector(state => state.tiles[tileName]);
    if (tile.occupied) {
        pieceClasses.push(`${tile.occupier}-${(tile.isWhite) ? "white" : "black"}`);
    }
    tileClasses.push(tile.highlighted ? "tile-highlighted" : "");

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
        <div className={"tile " + tileClasses.join(" ")} onContextMenu={highlightTile}>
            {tile.occupied &&
                <div className={"piece " + pieceClasses.join(" ")} alt="piece" />
            }
        </div>
    )
};

export default Tile;