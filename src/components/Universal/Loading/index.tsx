import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon-white.svg";
import './styles.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img
          src={KuboIcon}
          alt="Carregando"
          className="loading-icon"
        />
        <p className="loading-text">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;