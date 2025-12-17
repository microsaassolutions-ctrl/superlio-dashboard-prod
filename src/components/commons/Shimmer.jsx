import React from "react";

const Shimmer = () => {
    return (
        <div className="p-4 overflow-hidden" style={{ height: 'calc(100vh - 80px - 64px)' }}>
            <div className="flex flex-col justify-around animate-pulse h-full overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex justify-around gap-4 bg-white p-4 rounded-xl shadow-sm"
                    >
                        <div className="w-32 h-24 bg-gray-100 rounded-md" />
                        <div className="flex flex-col gap-3 flex-1">
                            <div className="h-5 bg-gray-200 rounded w-3/5" />
                            <div className="h-5 bg-gray-200 rounded w-4/5" />
                            <div className="h-5 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default Shimmer;
