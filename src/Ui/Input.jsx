const Input = ({ type, placeholder, onChange, onKeyDown, onBlur, value, className }) => {
  return (
    <input
      className={`block w-full border-gray-100 border-2 rounded-md h-12 text-xl pr-2.5 pl-2.5 ${className}`}
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
};
export default Input;
