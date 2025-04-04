import { useState } from 'react';

const RegistrationForm = () => {
  // Estados do componente
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Configuração dos passos do formulário
  const steps = [
    { label: 'Digite seu nome', key: 'name' },
    { label: 'Digite seu email', key: 'email' },
    { label: 'Crie uma senha', key: 'password' }
  ];

  // Calcula o progresso baseado no passo atual
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData[steps[currentStep].key]) {
      setErrorMessage('Este campo é obrigatório');
      return;
    }

    setErrorMessage('');

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Aqui você faria o envio final do formulário
      console.log('Dados enviados:', formData);
      alert('Cadastro completo!');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [steps[currentStep].key]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      {/* Barra de progresso */}
      <div style={styles.progressBar}>
        <div 
          style={{ 
            ...styles.progressFill, 
            width: `${progress}%` 
          }}
        ></div>
      </div>

      {currentStep < steps.length ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Cadastro ({currentStep + 1}/{steps.length})</h2>
          
          <input
            type={steps[currentStep].key === 'password' ? 'password' : 'text'}
            placeholder={steps[currentStep].label}
            value={formData[steps[currentStep].key]}
            onChange={handleInputChange}
            style={styles.input}
            autoFocus
          />

          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <button type="submit" style={styles.button}>
            {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
          </button>
        </form>
      ) : (
        <div style={styles.completionMessage}>
          <h2>Cadastro concluído com sucesso!</h2>
        </div>
      )}
    </div>
  );
};

// Estilos (pode ser movido para CSS separado)
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px'
  },
  progressBar: {
    height: '10px',
    backgroundColor: '#eee',
    borderRadius: '5px',
    marginBottom: '30px'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: '5px',
    transition: 'width 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#333'
  },
  input: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  error: {
    color: 'red',
    margin: '0',
    fontSize: '14px'
  },
  completionMessage: {
    textAlign: 'center',
    padding: '20px'
  }
};

export default RegistrationForm;