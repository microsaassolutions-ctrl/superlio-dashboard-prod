import React, { useState } from "react";
import useMainStore from "../../store/useMainStore";

const RegenerationReason = ({ type = 0, reasons = [], onClick, className = "" }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const regenOptions = useMainStore((state) => state.data?.regenOptions);

  const dynamicReasons = type === 0 && regenOptions?.post ? regenOptions.post : type === 1 && regenOptions?.carousel ? regenOptions.carousel : reasons;

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    onClick(reason);
  };

  return (
    <div className={`absolute z-99 bottom-[10px] right-28 mt-2 px-3 py-3 w-[313px] h-auto bg-white text-gray-800 text-sm rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.5)] p-2 ${className}`} >
      <h1 className="font-bold text-[14px] pb-2">
        Select your reason for Regeneration
      </h1>
      <hr className="py-1" />

      <div className="max-h-[180px] overflow-y-auto pr-1">
        {dynamicReasons.length > 0 ? (
          dynamicReasons.map((reason, index) => (
            <p
              key={index}
              className={`font-semibold text-[14px] py-1.5 cursor-pointer rounded-md transition-all duration-200 px-1 
                ${selectedReason?.title === reason.title ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
              `}
              onClick={() => handleReasonClick(reason)}
            >
              {reason.title}
            </p>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic py-1.5 px-1">
            No reasons available.
          </p>
        )}
      </div>

      {/* {reasons.length > 0 ? (
        reasons.map((reason, index) => (
          <p
            key={index}
            className={`font-semibold text-[14px] py-1.5 cursor-pointer rounded-md transition-all duration-200  px-1 
              ${selectedReason === reason ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
            `}
            onClick={() => handleReasonClick(reason)}
          >
            {reason}
          </p>
        ))
      ) : (
        <p className="text-gray-500 text-sm italic py-1.5 px-1">
          No reasons available.
        </p>
      )} */}
    </div>
  );
};

export default RegenerationReason;
