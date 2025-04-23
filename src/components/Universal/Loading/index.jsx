import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon-white.svg"

const Loading = ({ timeout = 5000 }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
        navigate(`/error/404`)
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, timeout]);

  return (
    <div style={styles.overlay}>
      <svg
        style={styles.icon}
        viewBox="0 0 50 50"
        xmlns={KuboIcon}
      >
        <path
          d="M25 5A20 20 0 1 1 5 25"
          fill="none"
          stroke="#2c3e50"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  icon: {
    width: '80px',
    height: '80px',
    animation: 'rotate 1.5s linear infinite',
  },
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
};

export default Loading;