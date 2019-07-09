import React from 'react';
import {ColorGame} from './ColorGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <ColorGame onGameOver={(score) => alert("Game Over! \n\n Score: "+score)} />
    </div>
  );
}

export default App;
