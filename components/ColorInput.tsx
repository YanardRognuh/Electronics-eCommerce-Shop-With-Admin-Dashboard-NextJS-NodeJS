// *********************
// Role of the component: Color chooser on single product page component
// Name of the component: ColorInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ColorInput />
// Input parameters: no input parameters
// Output: color chooser
// *********************

import React from "react";
import { FaCheck } from "react-icons/fa6";

const ColorInput = () => {
  return (
    <div
      className="flex flex-col gap-y-2 max-[500px]:items-center"
      data-testid="color-input-container"
    >
      <p className="text-xl" data-testid="selected-color-display">
        Color:{" "}
        <span
          className="text-lg font-normal"
          data-testid="selected-color-value"
        >
          silver
        </span>
      </p>
      <div className="flex gap-x-1" data-testid="color-options-container">
        <div
          className="bg-gray-400 w-10 h-10 rounded-full cursor-pointer flex justify-center items-center"
          data-testid="color-option-selected"
        >
          <FaCheck
            className="text-black"
            data-testid="selected-color-indicator"
          />
        </div>
        <div
          className="bg-gray-500 w-10 h-10 rounded-full cursor-pointer"
          data-testid="color-option-gray"
        ></div>
        <div
          className="bg-blue-500 w-10 h-10 rounded-full cursor-pointer"
          data-testid="color-option-blue"
        ></div>
      </div>
    </div>
  );
};

export default ColorInput;
