import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";

const MoveSequence = ({ sequence }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    for (let i = 0; i < sequence.length; i++) {
      dispatch({
        type: "chessfront/movePiece",
        payload: {
          move: sequence[i],
        },
      });
    }
  }, [dispatch, sequence]);
  
  return null;
};

export default MoveSequence;