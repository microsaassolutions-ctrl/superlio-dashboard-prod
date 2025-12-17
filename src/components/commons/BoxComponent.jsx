import React from 'react';

const BoxComponent = ({ imageSrc, iconSrc, text, onClick, containerClass, imageClass, textClass, active = false }) => {
  return (
    <div className={`relative ${containerClass}`}>
      {iconSrc && (
        <div className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md z-10">
          <img src={iconSrc} alt="Icon" className="w-4 h-4" />
        </div>
      )}

      <div className="flex items-center justify-center max-h-[100%] pt-[3px]">
        <img
          src={imageSrc}
          alt="Box Image"
          className={`sm:w-full object-cover cursor-pointer transition-all duration-300 ${active ? "border-[2px] border-[#614bfb]" :""}
            ${imageClass}`}
          onClick={onClick}
        />
      </div>

      {text && (
        <div className={`py-1 text-center text-black ${textClass}`} onClick={onClick}>
          <p className={`truncate text-[8px]  ${active ? "text-[#614bfb] scale-115" : "text-black scale-100"}`} title={text}>{text}</p>
        </div>
      )}
    </div>
  );
};

export default BoxComponent;
