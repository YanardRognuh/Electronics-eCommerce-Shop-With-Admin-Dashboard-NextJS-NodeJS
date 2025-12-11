// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} />
// Input parameters: CustomButtonProps interface
// Output: custom button component
// *********************

import React from "react";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string;
  textSize: string;
  "data-testid"?: string; // ← TAMBAHKAN INI
  onClick?: () => void; // ← TAMBAHKAN INI (optional, untuk button yang bukan submit)
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize,
  "data-testid": dataTestId, // ← TAMBAHKAN INI
  onClick, // ← TAMBAHKAN INI
}: CustomButtonProps) => {
  return (
    <button
      type={`${buttonType}`}
      className={`${
        customWidth !== "no" && `w-${customWidth}`
      } uppercase bg-white px-${paddingX} py-${paddingY} text-${textSize} border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2`}
      data-testid={dataTestId} // ← INI SUDAH BENAR, tinggal tambah parameter aja
      onClick={onClick} // ← TAMBAHKAN INI
    >
      {text}
    </button>
  );
};

export default CustomButton;
