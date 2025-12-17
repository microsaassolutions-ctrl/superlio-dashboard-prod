import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, isToday, isBefore, startOfDay } from "date-fns";
import { FaClock } from "react-icons/fa";

const TimePicker = ({ date, setSelectedTime }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [minTime, setMinTime] = useState(null);
  const [maxTime] = useState(setHours(setMinutes(new Date(), 45), 23));
  const [timeIntervals] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSelectedTime, setLastSelectedTime] = useState(null);

  const getNextSlot = (base) => {
    let future = new Date(base.getTime() + 15 * 60000);
    const minutes = future.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;

    if (roundedMinutes === 60) {
      future.setHours(future.getHours() + 1);
      future.setMinutes(0);
    } else {
      future.setMinutes(roundedMinutes);
    }

    future.setSeconds(0);
    future.setMilliseconds(0);
    return future;
  };

  useEffect(() => {
    if (!date) return;

    const selected = new Date(date);
    const now = new Date();
    const startOfTodayDate = startOfDay(now);

    if (isBefore(selected, startOfTodayDate)) {
      setMinTime(null);
      setSelectedDate(null);
      setSelectedTime(null);
      return;
    }

    if (isToday(selected)) {
      const future = getNextSlot(now);
      if (future > maxTime) {
        const tomorrow = startOfDay(new Date(now));
        tomorrow.setDate(tomorrow.getDate() + 1);

        setMinTime(startOfDay(tomorrow));
        setSelectedDate(tomorrow);
        setSelectedTime("00:00");
        setLastSelectedTime("00:00");
        return;
      }

      setMinTime(future);
      if (lastSelectedTime) {
        const selectedTodayTime = new Date(now);
        const [h, m] = lastSelectedTime.split(":").map(Number);
        selectedTodayTime.setHours(h, m, 0, 0);

        if (isBefore(selectedTodayTime, future)) {
          setSelectedDate(future);
          setSelectedTime(future.toTimeString().slice(0, 5));
        } else {
          setSelectedDate(selectedTodayTime);
          setSelectedTime(lastSelectedTime);
        }
      } else {
        setSelectedDate(future);
        setSelectedTime(future.toTimeString().slice(0, 5));
      }
    } else {
      const startOfDayTime = new Date(selected);
      startOfDayTime.setHours(0, 0, 0, 0);
      setMinTime(startOfDayTime);
      if (lastSelectedTime) {
        const futureTime = new Date(selected);
        const [h, m] = lastSelectedTime.split(":").map(Number);
        futureTime.setHours(h, m, 0, 0);
        setSelectedDate(futureTime);
        setSelectedTime(lastSelectedTime);
      } else {
        const defaultTime = setHours(setMinutes(new Date(selected), 0), 0);
        setSelectedDate(defaultTime);
        setSelectedTime(defaultTime.toTimeString().slice(0, 5));
        setLastSelectedTime(defaultTime.toTimeString().slice(0, 5));
      }
    }
  }, [date]);

  useEffect(() => {
    if (selectedDate) {
      const formatted = selectedDate.toTimeString().slice(0, 5);
      setLastSelectedTime(formatted);
    }
  }, [selectedDate]);

  return (
    <div className="relative flex">
      <div
        className="flex items-center py-3 pl-4 space-x-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <FaClock className="text-gray-500" />
        <span className="text-[12px] sm:text-xs md:text-lg tracking-tight whitespace-nowrap">
          {selectedDate
            ? selectedDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "00:00"}
        </span>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          const formattedTime = date.toTimeString().slice(0, 5);
          setSelectedTime(formattedTime);
          setIsOpen(false);
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        minTime={minTime}
        maxTime={maxTime}
        dateFormat="h:mm aa"
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        className="hidden absolute h-0 w-full"
      />
    </div>
  );
};

export default React.memo(TimePicker);
