import React from "react";

const Checkbox = ({
  checked = false,
  onChange,
  custom = false,
  color = "#614bfb",
  label = "",
  disabled = false,
}) => {
  return (
    custom === true ? (
      <label className={`switch  ${disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={custom ? { "--custom-color": color } : {}}
          disabled={disabled}
        />
        <span className="slider round"></span>
      </label>
    ) : (
      <label
        className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={custom ? "custom-checkbox" : ""}
          style={custom ? { "--custom-color": color } : {}}
          disabled={disabled}
        />
        {label && <span>{label}</span>}
      </label>
    )
  );
};
// "appearance-none w-4 h-4 rounded border border-gray-300 checked:bg-blue-500"
export default Checkbox;
