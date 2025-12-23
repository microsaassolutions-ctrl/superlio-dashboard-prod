import React, { useState, useEffect, useRef } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    isBefore,
    isAfter
} from "date-fns";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DateRangeFilter = ({ onApply }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (isBefore(day, startDate)) {
            if (isSameDay(day, startDate)) {
                setEndDate(day); // Same day selection
            } else {
                setStartDate(day);
                setEndDate(null);
            }
        } else {
            setEndDate(day);
        }
    };

    const handleApply = () => {
        onApply({ start: startDate, end: endDate || startDate }); // Handle single day selection
        setIsOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-lg font-bold text-gray-900">
                    {format(currentMonth, "MMMM")}
                </h2>
                <div className="flex space-x-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                        <FiChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                        <FiChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["M", "T", "W", "T", "F", "S", "S"];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
        const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDateGrid;
        let formattedDate = "";

        const daysInInterval = eachDayOfInterval({
            start: startDateGrid,
            end: endDateGrid
        });

        daysInInterval.forEach((dayItem) => {
            formattedDate = format(dayItem, dateFormat);

            const isSelectedStart = startDate && isSameDay(dayItem, startDate);
            const isSelectedEnd = endDate && isSameDay(dayItem, endDate);
            // Determine if in range. Handle case where only start is selected (no range)
            const isInRange = startDate && endDate && isWithinInterval(dayItem, { start: startDate, end: endDate });
            const isCurrentMonth = isSameMonth(dayItem, monthStart);

            let cellClass = "relative w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors mx-auto ";

            if (!isCurrentMonth) {
                cellClass += "text-gray-300 ";
            } else if (isSelectedStart || isSelectedEnd) {
                cellClass += "bg-[#8B5CF6] text-white font-semibold z-10 ";
            } else if (isInRange) {
                cellClass += "text-gray-900 bg-purple-50 ";
            } else {
                cellClass += "text-gray-900 hover:bg-gray-100 ";
            }

            // Range styling wrapper
            const isRangeStart = isSelectedStart && endDate && !isSameDay(startDate, endDate);
            const isRangeEnd = isSelectedEnd && startDate && !isSameDay(startDate, endDate);
            const isMiddle = isInRange && !isSelectedStart && !isSelectedEnd;

            let wrapperClass = "p-0.5 w-full ";
            if (isRangeStart) wrapperClass += "bg-gradient-to-r from-transparent to-purple-50 rounded-l-full ";
            if (isRangeEnd) wrapperClass += "bg-gradient-to-l from-transparent to-purple-50 rounded-r-full ";
            if (isMiddle) wrapperClass += "bg-purple-50 ";

            days.push(
                <div
                    className={wrapperClass}
                    key={dayItem.toString()}
                    onClick={() => onDateClick(dayItem)}
                >
                    <div className={cellClass}>
                        {formattedDate}
                    </div>
                </div>
            );
        });

        // Chunk into weeks
        for (let i = 0; i < days.length; i += 7) {
            rows.push(
                <div className="grid grid-cols-7" key={i}>
                    {days.slice(i, i + 7)}
                </div>
            );
        }

        return <div className="mb-4">{rows}</div>;
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        onApply({ start: null, end: null });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg border transition-colors ${isOpen || (startDate && endDate)
                    ? "border-[#8B5CF6] text-[#8B5CF6] bg-purple-50"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                title="Filter by Date Range"
            >
                <FiCalendar className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-5 w-[320px]">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!startDate}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm ${startDate
                                ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;
