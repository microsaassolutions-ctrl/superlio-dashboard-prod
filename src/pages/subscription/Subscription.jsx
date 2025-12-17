import React from "react";

const Subscription = ({ subscriptionDetails }) => {
    const { message, url, btn } = subscriptionDetails;
    return (
        <div className="unsubscribe p-2 min-h-[calc(100vh-144px)] flex flex-col justify-center items-center container mx-auto py-8 px-4 max-w-10/12">
            <div className="unsubscribe-box flex flex-col justify-center items-center h-[max-content] py-[60px] px-[20px] rounded-[10px] shadow-custom-neumorphic bg-[#f7f7f7] mx-auto max-w-[500px]">
                <h4 className="text-2xl font-semibold">{message}</h4>
                <div className="mt-4">
                    <a href={`${url}`} className="w-fit sm:w-[283px] max-w-full mx-auto flex flex-col items-center text-[#fff] px-[10px] py-[10px] text-[16px] font-bold transition duration-200 ease-in-out bg-[#479739] rounded-[10px] shadow-[3.2px_3.2px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_8px_#fff,4.8px_4.8px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_6.4px_#fff] hover:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.4),inset_2px_2px_2px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.1)]  cursor-pointer">
                        {btn}
                    </a>
                </div>
            </div>
        </div>)
}

export default Subscription;
