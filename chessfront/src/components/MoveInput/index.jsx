import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

const MoveInput = () => {
    const dispatch = useDispatch();

    const inputRef = useRef(null);

    const makeMove = () => {
        console.log(inputRef.current.value);
        dispatch({
            type: "chessfront/movePiece",
            payload: {
                move: inputRef.current.value,
            },
        });
    };

    return (
        <div>
            <input type="text" ref={inputRef}/>
            <button onClick={()=>makeMove()}>Submit</button>
        </div>
    );
};

export default MoveInput;