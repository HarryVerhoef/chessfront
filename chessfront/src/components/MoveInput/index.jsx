import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

const MoveInput = () => {
    const dispatch = useDispatch();

    const inputRef = useRef(null);

    const makeMove = (e) => {
        console.log(inputRef.current.value);
        dispatch({
            type: "chessfront/movePiece",
            payload: {
                move: inputRef.current.value,
            },
        });
        e.preventDefault();
    };

    return (
        <form action="#" onSubmit={(e) => makeMove(e)}>
            <input type="text" ref={inputRef}/>
            <input type="submit" value="Submit"/>
        </form>
    );
};

export default MoveInput;