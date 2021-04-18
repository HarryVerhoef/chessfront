import React from 'react';
import Row from '../Row';
import { useSelector } from 'react-redux';
import './Grid.css';

const ChessGrid = () => {

    const isDragging = useSelector(state => state.isDragging);

    let rows = [];
    for (let i=8; i>0; i--) {
        rows.push(<Row rowNo={i} />)
    };

    return (
        <div className={isDragging ? "container dragging" : "container"}>
            {rows}
        </div>
    );
};

export default ChessGrid;