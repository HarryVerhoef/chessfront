import ChessGrid from './components/Grid';
import MoveSequence from './components/MoveSequence';
import MoveInput from './components/MoveInput'
import './App.css';

function App() {

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
