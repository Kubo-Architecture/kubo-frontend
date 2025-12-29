import PropTypes from 'prop-types';
import './styles.css';

const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error
}: any) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? 'input-error' : ''}
      />
      <div className="error-container">
        {error && <span className="error-message">{error}</span>}
      </div>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string
};

export default InputField;