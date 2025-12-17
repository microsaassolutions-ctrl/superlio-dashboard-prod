import React from "react";
export default function PostLoader({ details }) {
    return (
        <section className="fixed top-0 left-0 w-full h-full flex justify-center items-center opacity-[0.9] z-999 bg-gray-700 py-20 dark:bg-dark">
            <div className="flex flex-col items-center gap-4 w-full px-4 max-w-[600px]">
                {/* Progress bar */}
                 <div className="text-[22px] text-white font-bold text-center mb-4">
                    <p>Don’t close the browser right away after scheduling—LinkedIn confirmation usually takes a minute or two.</p>
                </div>
                <div className="flex gap-[0px] rounded-[10px] overflow-hidden">
                    {Array.from({ length: 8 }, (_, i) => (
                        <div
                            key={i}
                            className={`w-[40px] h-[12px] border-r-[1px] border-[#fff] ${i < details?.progress ? 'bg-blue-500' : 'bg-gray-300'}`}
                        ></div>
                    ))}
                </div>

                {/* Message */}
                <div className="w-full">
                    <p className="text-[22px] text-[#fff] font-bold break-words text-center">
                        {details?.message}
                        <span className="inline-block w-[30px]">
                            <span className="text-[30px] text-[#fff] typing-dots"></span>
                        </span>
                    </p>
                </div>
            </div>
        </section>

    );
}