import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon-white.svg";
import './styles.css'; // Importe o arquivo CSS

const Loading = ({ timeout = 5000 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/error/404');
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, timeout]);

  return (
    <div className="loading-overlay">
      <img 
        src={KuboIcon} 
        alt="Carregando" 
        className="loading-icon" 
      />
    </div>
  );
};

export default Loading;