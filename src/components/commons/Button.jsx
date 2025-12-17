import React from "react";

const Button = ({
  children,
  onClick = () => { },
  type = "primary",
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = "", //"left", "right", or "top"
  className = "",
  style = {},
  title = "",
  display = "inline-flex",
  hideIcon = true,
  onMouseEnter = () => { },
  onMouseLeave = () => { },
  textClass = ""
}) => {
  const baseStyles = `${display} items-center justify-center gap-2 px-4 py-2 rounded-md text-base font-medium transition-colors transform duration-200 border-none`;

  const typeStyles = {
    primary: "bg-primary-color text-white hover:bg-[#614bfb]",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    custom: "",
  };

  const disabledStyles = "opacity-60 cursor-not-allowed";
  const loadingStyles = "opacity-70 cursor-progress";

  const computedStyles = `${baseStyles} ${typeStyles[type] || ""} ${loading ? loadingStyles : ""
    } ${disabled || loading ? disabledStyles : "cursor-pointer"} ${className}`;

  const renderIcon = () => {
    if (!icon) return null;
    const iconElement =
      typeof icon === "string" ? (
        <img src={icon} alt="icon" className="w-5 h-5" />
      ) : (
        icon
      );

    // Don't hide the icon on small screens if there's no `children`
    const iconClass =
      children === undefined || children === null ? "flex items-center" : hideIcon && "hidden md:flex items-center";

    return (
      <span className={iconClass}>
        {iconElement}
      </span>
    );
  };

  return (
    <button
      className={computedStyles}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || loading}
      style={style}
      title={title}
    >
      <div
        className={`block text-center w-full overflow-hidden text-ellipsis whitespace-nowrap gap-1 ${iconPosition ? iconPosition === "top" ? "flex flex-col items-center" : "flex items-center" : "text-center"
          } ${textClass}`}
      >
        {icon && iconPosition === "left" && renderIcon()}
        {icon && iconPosition === "top" && (
          <span className="flex items-center justify-center mb-1">{renderIcon()}</span>
        )}
        {children}
        {icon && iconPosition === "right" && renderIcon()}
      </div>
    </button>
  );
};

export default Button;
