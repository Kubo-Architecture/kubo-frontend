
export default function ProgressBar({ progresso }: any) {
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