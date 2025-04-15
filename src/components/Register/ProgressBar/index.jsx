import { useState } from 'react';

export default function ProgressBar({ progresso }){
  return (
    <div style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      margin: '20px 0'
    }}>
      <div style={{
        width: `${progresso}%`,
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: '10px',
        transition: 'width 0.3s ease'
      }}></div>
    </div>
  );
};

// Exemplo de uso
const App = () => {
  const [passoAtual, setPassoAtual] = useState(1);
  const totalPassos = 5;

  const calcularProgresso = () => (passoAtual / totalPassos) * 100;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <ProgressBar progresso={calcularProgresso()} />
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={() => setPassoAtual(p => Math.max(1, p - 1))}
          disabled={passoAtual === 1}
        >
          Anterior
        </button>
        
        <span>Passo {passoAtual} de {totalPassos}</span>
        
        <button 
          onClick={() => setPassoAtual(p => Math.min(totalPassos, p + 1))}
          disabled={passoAtual === totalPassos}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};