import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition ${className}`}
      {...props} // Spread all additional props dynamically
    >
      {children}
    </button>
  );
};

export default Button;
