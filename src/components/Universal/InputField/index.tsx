import PropTypes from 'prop-types';

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
    <div className="h-[110px]">
      <label 
        htmlFor={name} 
        className="block h-[40px] font-light text-[20px] font-montserrat"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full py-[0.5rem] text-[1.1rem] border-none outline-none bg-transparent rounded-none
          transition-[border-color] duration-300 ease-in-out
          placeholder:text-[#a0a0a0] placeholder:opacity-100 placeholder:font-light placeholder:tracking-[0.5px]
          ${error ? 'border-b-2 border-b-[#ff4444]' : 'border-b border-b-gray-300'}
          max-[400px]:w-full`}
      />
      <div className="pt-[0.3rem]">
        {error && (
          <span className="text-[#ff4444] text-[0.8rem] mt-[0.5rem] font-light tracking-[0.3px]">
            {error}
          </span>
        )}
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