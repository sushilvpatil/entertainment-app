const Label = ({ htmlFor, children, className,...props }) => {
    return (
      <label htmlFor={htmlFor} className="block text-gray-400 text-sm mb-2" {...props}>
        {children}
      </label>
    );
  };
  
  export default Label;
  