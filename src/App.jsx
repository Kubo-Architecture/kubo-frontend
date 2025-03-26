
import { useState } from 'react';
import './App.css';
import Tela from './Tela'; // Importando o componente

import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Tela /> {/* Chamando o componente */}
    </>
  );
}

export default App;
