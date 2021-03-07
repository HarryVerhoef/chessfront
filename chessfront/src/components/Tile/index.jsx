import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Tile.css';

const Tile = ({ rowNo, colNo }) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch({ type: "chessfront/resetPiecesToStart" });
    }, [dispatch]);

    const colChar = String.fromCharCode(96 + colNo); // a=97 in ASCII
    const tileName = colChar + rowNo.toString();
    const colouring = (rowNo & 1) === (colNo & 1) ? "dark" : "light";

    const tile = useSelector(state => state.tiles[tileName]);

    return (
        <div className={`tile ${colouring}`}>
            {tile.occupied &&
                <div className={`${tile.occupier}-${(tile.isWhite) ? "white" : "black"}`} alt="piece" />
            }
        </div>
    )
};

export default Tile;