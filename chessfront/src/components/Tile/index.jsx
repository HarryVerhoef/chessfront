import React from 'react';
import { useSelector } from 'react-redux';
import './Tile.css';

const Tile = ({ rowNo, colNo }) => {
    const colChar = String.fromCharCode(96 + colNo); // a=97 in ASCII
    const tileName = colChar + rowNo.toString();
    const colouring = (rowNo & 1) === (colNo & 1) ? "dark" : "light";

    const isOccupied = useSelector(state => state.tiles[tileName].occupied);
    console.log(isOccupied);

    return (
        <div className={`tile ${colouring}`}>
            {tileName}
        </div>
    )
};

export default Tile;