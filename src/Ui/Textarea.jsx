const Textarea = ({ type, placeholder, onChange, value, className }) => {
  return (
    <textarea
      className={`block w-full border-gray-100 border-2 rounded-md h-20 max-h-30 min-h-14 text-xl p-2.5 ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
export default Textarea;
