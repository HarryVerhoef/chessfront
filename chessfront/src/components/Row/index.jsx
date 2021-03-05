import Tile from '../Tile';

const Row = ({ rowNo }) => {

    let tiles = [];

    for (let i=1; i<9; i++) {
        tiles.push(<Tile rowNo={rowNo} colNo={i} key={i.toString() + rowNo.toString()} />)
    }

    return (
        <div className="row">
            {tiles}
        </div>
    );
};

export default Row;