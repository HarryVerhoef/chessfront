import React from 'react';
import Row from '../Row';

const ChessGrid = () => {

    let rows = [];
    for (let i=8; i>0; i--) {
        rows.push(<Row rowNo={i} />)
    };

    return (
        <div className="container">
            {rows}
        </div>
    );
};

export default ChessGrid;