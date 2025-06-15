const Select = ({ onChange, options, selectedVal }) => {
  return (
    <select
      className="cursor-pointer p-2 rounded-3xl w-35 border border-gray-700 bg-gray-950"
      onChange={onChange}
      value={selectedVal} // <-- вот так правильно
    >
      {options.map((option) => (
        <option key={option.val} value={option.val}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default Select;
