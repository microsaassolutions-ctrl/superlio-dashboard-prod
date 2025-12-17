import React, { useRef, useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({
  label,
  color,
  onChange,
  containerClass = '',
  inputClass = '',
  labelClass = '',
  textClass = ''
}) => {
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hexValue, setHexValue] = useState(color || '#ffffff');

  // Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync hexValue when external color prop changes
  useEffect(() => {
    setHexValue(color);
  }, [color]);

  // Validate and apply new color from input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setHexValue(val);
    if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
      onChange(val);
    }
  };

  // Copy color when Ctrl+C inside input
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      navigator.clipboard.writeText(hexValue);
    }
  };

  return (
    <div ref={pickerRef} className={`flex flex-col items-center relative ${containerClass}`}>
      <label className={`text-xs font-medium ${labelClass}`}>{label}</label>

      <div
        className="cursor-pointer inline-flex justify-center items-center gap-1 lg:gap-2 sm:border border-[#797B96] shadow-sm rounded-md sm:px-1 lg:px-2 py-1"
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <div
          className={`w-[15px] h-[15px] rounded-full ${inputClass}`}
          style={{ backgroundColor: color }}
        />
        <span className={`${textClass}`}>{color}</span>
      </div>

      {showColorPicker && (
        <div className="absolute top-full mt-2 z-50 bg-white p-2 rounded shadow">
          <HexColorPicker
            color={hexValue}
            onChange={(val) => {
              setHexValue(val);
              onChange(val);
            }}
          />
          <input
            ref={inputRef}
            type="text"
            value={hexValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="mt-2 border border-[#797B96] px-2 py-1 text-sm w-full rounded"
            maxLength={7}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
