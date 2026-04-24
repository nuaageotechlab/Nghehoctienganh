import React from "react";

export function Slider({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className="w-full"
    />
  );
}