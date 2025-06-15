const Title = ({ children, className }) => {
  return <h1 className={`font-semibold text-6xl text-center ${className}`}>{children}</h1>;
};
export default Title;
