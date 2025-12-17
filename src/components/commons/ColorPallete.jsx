import React from "react";
import Input from "./Input";

const ColorPallete = ({
  primary,
  secondary,
  tertiary,
  background,
  onClick,
  containerClass,
  textClass,
  active
}) => {
  return (
    <div
      className={`flex items-center cursor-pointer bg-[#a7b4eb54] ${containerClass || ""} ${active ? 'border-[1px] !border-[#614bfb]' : 'border-[1px] border-transparent'}`}
      onClick={() => onClick({ primary, secondary, background })}
    >
      <div
        className="w-[16px] h-[18px]"
        style={{ backgroundColor: primary }}
      ></div>
      <div
        className="w-[16px] h-[18px]"
        style={{ backgroundColor: secondary }}
      ></div>
      <div
        className="w-[16px] h-[18px]"
        style={{ backgroundColor: tertiary }}
      ></div>
      <div
        className="w-[16px] h-[18px]"
        style={{ backgroundColor: background }}
      ></div>
    </div>
  );
};

export default ColorPallete;
