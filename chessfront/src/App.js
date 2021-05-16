import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ChessGrid from './components/Grid';
import MoveSequence from './components/MoveSequence';
import MoveInput from './components/MoveInput'
import './App.css';
import { concedeCheckBoard } from './redux/presetBoards';

function App() {

  const dispatch = useDispatch();

  const ruyLopez = [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
    "d5",
    "exd5",
  ];

  const timeStep = 500; // Milliseconds

  useEffect(() => {
    console.log("CONCEDE CHECK BOARD");
    console.log(concedeCheckBoard);
    dispatch({
      type: "chessfront/loadBoard",
      payload: {
        board: concedeCheckBoard,
      }
    })
  });

  return (
    <div className="App">
      <body>
        <ChessGrid />
        {/* <MoveSequence sequence={ruyLopez} timeStep={timeStep}/> */}
        <MoveInput />
      </body>
    </div>
  );
}

export default App;
