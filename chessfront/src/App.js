import ChessGrid from './components/Grid';
import MoveInput from './components/MoveInput'
import './App.css';

function App() {
  return (
    <div className="App">
      <body>
        <ChessGrid />
        <MoveInput />
      </body>
    </div>
  );
}

export default App;
