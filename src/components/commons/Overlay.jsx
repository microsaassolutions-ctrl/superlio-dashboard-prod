import React from "react";

const Overlay = ({ children, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-[0.5] flex items-center justify-center z-[999]"
        onClick={onClose}
      ></div>
      <div
        className="rounded-lg shadow-lg z-[10000] relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </>
  );
};

export default Overlay;
