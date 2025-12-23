import React, { useState, useEffect } from "react";
import { format, addMinutes, isBefore } from "date-fns";
import Button from "./Button";

// Helper to get initial time values
const getInitialTimeValues = () => {
  const future = addMinutes(new Date(), 2);
  let h = future.getHours();
  const m = future.getMinutes();
  const p = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return { date: format(future, "yyyy-MM-dd"), hour: h, minute: m, period: p };
};

const ScheduleCard = ({ handlePublish, subscriptData, onClose, loading }) => {
  const initialValues = getInitialTimeValues();
  const [date, setDate] = useState(initialValues.date);
  const [hour, setHour] = useState(initialValues.hour);
  const [minute, setMinute] = useState(initialValues.minute);
  const [period, setPeriod] = useState(initialValues.period);
  const [isExpired, setIsExpired] = useState(false);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    if (subscriptData) {
      let expiryDateStr = subscriptData?.subscription_expiry_date || subscriptData?.scheadule_date;
      if (expiryDateStr) {
        const expiryDate = new Date(expiryDateStr);
        // Check if already expired
        setIsExpired(expiryDate < new Date());

        // Calculate max selectable date (expiry + 1 day grace)
        const maxSelectableDate = new Date(expiryDate);
        maxSelectableDate.setDate(maxSelectableDate.getDate() + 1);
        setMaxDate(format(maxSelectableDate, "yyyy-MM-dd"));
      }
    }
  }, [subscriptData]);

  const handleSchedule = () => {
    // Convert 12-hour format back to 24-hour for the parent component
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const timeString = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    handlePublish({
      selectedDate: date,
      selectedTime: timeString,
      schedule: true
    });
  };

  // Helper to format the sub-header text
  const getFormattedDateTimeString = () => {
    if (!date) return "";
    try {
      const d = new Date(date);
      // We need to construct the full date object with time to format correctly
      let h = parseInt(hour);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;

      d.setHours(h);
      d.setMinutes(minute);

      return `${format(d, "EEE, MMM d")}, ${hour}:${minute.toString().padStart(2, '0')} ${period}, according to your timezone.`;
    } catch (e) {
      return "";
    }
  };

  const handleHourChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    if (val > 12) val = 12;
    if (val < 1) val = 1;
    setHour(val);
  };

  const handleMinuteChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    if (val > 59) val = 59;
    if (val < 0) val = 0;
    setMinute(val);
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl rounded-xl w-[400px] font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Schedule the post</h2>
      <p className="text-gray-500 text-sm mb-6">
        {getFormattedDateTimeString()}
      </p>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
            max={maxDate || undefined}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
        <div className="flex gap-2">
          {/* Hour Input */}
          <div className="relative w-20">
            <input
              type="number"
              value={hour}
              onChange={handleHourChange}
              className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
              max="12"
            />
            {/* Custom Steppers for Hour */}
            <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-center border-l border-gray-200 pl-1">
              <button onClick={() => setHour(h => h >= 12 ? 1 : h + 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px] mb-0.5">▲</button>
              <button onClick={() => setHour(h => h <= 1 ? 12 : h - 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px]">▼</button>
            </div>
          </div>

          {/* Minute Input */}
          <div className="relative w-20">
            <input
              type="number"
              value={minute}
              onChange={handleMinuteChange}
              className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              max="59"
            />
            {/* Custom Steppers for Minute */}
            <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-center border-l border-gray-200 pl-1">
              <button onClick={() => setMinute(m => m >= 59 ? 0 : m + 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px] mb-0.5">▲</button>
              <button onClick={() => setMinute(m => m <= 0 ? 59 : m - 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px]">▼</button>
            </div>
          </div>

          {/* AM/PM Select */}
          <div className="relative w-20">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Close
        </button>
        <Button
          onClick={handleSchedule}
          className="px-8 py-2 bg-[#8B5CF6] text-white font-bold rounded-md hover:bg-[#7C3AED] transition shadow-md flex items-center justify-center gap-2"
          disabled={isExpired || loading}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? "Scheduling..." : "Schedule"}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ScheduleCard);
