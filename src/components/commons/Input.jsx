import React from "react";

const Input = ({
  type = "text",
  label = "",
  readOnly = false,
  placeholder = "",
  value,
  defaultValue,
  onChange = () => { },
  onBlur = () => { },
  // errorMessage = "Invalid input",
  loading = false,
  disabled = false,
  className = "",
  style = {},
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1">
      {label && <label className="text-gray-700 text-sm">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        defaultValue={defaultValue}
        className={`
          p-2 border-2 rounded-md outline-none transition-colors duration-200 text-black
          ${loading ? "bg-gray-100" : ""}
          focus:border-blue-500
          ${className}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onChange={(e) => onChange(e)}
        onBlur={onBlur}
        disabled={disabled}
        style={style}
      />
      {loading && <span className="text-blue-500 text-sm">Loading...</span>}
      {/* {error && <span className="text-red-500 text-sm">{errorMessage}</span>} */}
    </div>
  );
};
// ${error ? "border-red-500" : "border-gray-300"}

export default Input;
