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
  ];

  return (
    <div className="App">
      <body>
        <ChessGrid />
        <MoveSequence sequence={ruyLopez} />
        <MoveInput />
      </body>
    </div>
  );
}

export default App;
