// *********************
// Role of the component: Quantity input for incrementing and decrementing product quantity on the single product page
// Name of the component: QuantityInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <QuantityInput quantityCount={quantityCount} setQuantityCount={setQuantityCount} />
// Input parameters: QuantityInputProps interface
// Output: one number input and two buttons
// *********************

"use client";

import React from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({
  quantityCount,
  setQuantityCount,
}: QuantityInputProps) => {
  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      setQuantityCount(quantityCount + 1);
    } else if (actionName === "minus" && quantityCount !== 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  return (
    <div
      className="flex items-center gap-x-4 max-[500px]:justify-center"
      data-testid="quantity-input-container"
    >
      <p className="text-xl" data-testid="quantity-label">
        Quantity:{" "}
      </p>

      <div
        className="flex items-center gap-1"
        data-testid="quantity-controls-container"
      >
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex justify-center items-center border"
          onClick={() => handleQuantityChange("minus")}
          data-testid="quantity-decrement-button"
        >
          <FaMinus data-testid="quantity-minus-icon" />
        </button>

        <input
          type="number"
          id="Quantity"
          disabled={true}
          value={quantityCount}
          className="h-10 w-24 rounded border-gray-200 sm:text-sm"
          data-testid="quantity-display-input"
        />

        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex justify-center items-center border"
          onClick={() => handleQuantityChange("plus")}
          data-testid="quantity-increment-button"
        >
          <FaPlus data-testid="quantity-plus-icon" />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
