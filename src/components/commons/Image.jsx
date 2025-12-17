import React, { useState } from "react";

const ImageComponent = ({ src, alt = "Image", className = "", title = "", style = {}, fallbackSrc = null, onClick = () => { } }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      onClick={onClick}
      src={hasError && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      title={title}
      className={`object-cover ${className}`}
      style={style}
      onError={handleError}
    />
  );
};

export default ImageComponent;
