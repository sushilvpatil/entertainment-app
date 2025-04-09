import { Children } from "react";

const TextField = ({ type, placeholder, value, onChange ,...probs}) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-transparent border-b border-gray-600 focus:outline-none focus:border-red-500 text-white" 
        {...probs}
      />
    );
  };
  
  export default TextField;

