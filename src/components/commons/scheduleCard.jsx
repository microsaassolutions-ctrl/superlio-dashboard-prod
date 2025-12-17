import React, { useState, useRef, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Button from "./Button";
import TimePicker from "./TimePicker";

const ScheduleCard = ({ handlePublish, subscriptData}) => {
  const [isExpired, setIsExpired] = useState(true);
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  const formattedDate = now.toLocaleDateString("en-CA");
  const formattedTime = now
  .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [maxDateString, setMaxDateString] = useState(formattedDate);
  const [selectedTime, setSelectedTime] = useState(formattedTime);
  const dateInputRef = useRef(null);
  useEffect(()=>{
    if(subscriptData){
      let expiryDateStr = subscriptData?.subscription_expiry_date;
      let expiryDate = new Date(expiryDateStr) < new Date();
      setIsExpired(expiryDate);
      if (subscriptData?.scheadule_date) {
        const maxDate = new Date(subscriptData.scheadule_date);
        setMaxDateString(maxDate.toISOString().split("T")[0]);
      }
    }
  },[subscriptData]);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md rounded-md">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="font-semibold sm:text-xs md:text-lg">
            Please Select a Date and Time in the Future to Publish your Post
          </h1>
        </div>
        <div className="flex space-x-4 px-2 rounded-md border-2">
          <div
            className="flex-1 flex items-center py-3 pl-4 space-x-2 cursor-pointer"
            onClick={() => dateInputRef.current.showPicker()}
          >
            <FaCalendarAlt className="text-gray-500" />
            <span className="text-[12px] sm:text-xs md:text-lg tracking-tight whitespace-nowrap">
              {selectedDate}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toLocaleDateString("en-CA")} 
              max={maxDateString}
              className="opacity-0 w-1 h-1"
            />
          </div>
          <div className="flex-1 flex items-center py-3 pl-4 space-x-2 cursor-pointer border-l-2">
            <TimePicker date={selectedDate} setSelectedTime={setSelectedTime} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={() =>
              handlePublish({ selectedDate, selectedTime, schedule: true })
            }
            className="p-3 my-1 rounded bg-[#614bfb] text-white font-bold"
            disabled={isExpired}
          >
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScheduleCard);
