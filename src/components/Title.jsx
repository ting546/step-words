const Title = ({ children, className }) => {
  return (
    <h1 className={`font-semibold text-2xl lg:text-6xl sm:text-4xl text-center ${className}`}>
      {children}
    </h1>
  );
};
export default Title;
