import { useEffect } from 'react';
import { useDispatch } from "react-redux";

const MoveSequence = ({ sequence, timeStep }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    let i = 0;
    let moveInterval = setInterval(() => {
      if (i === sequence.length - 1) {
        clearTimeout(moveInterval);
      };
      dispatch({
        type: "chessfront/movePiece",
        payload: {
          move: sequence[i++],
        },
      });
    }, 1000);
  }, [dispatch, sequence]);
  
  return null;
};

export default MoveSequence;