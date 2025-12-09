// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeartElement />
// Input parameters: no input parameters
// Output: wishlist icon with quantity
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

interface HeartElementProps {
  wishQuantity: number;
  "data-testid"?: string;
}

const HeartElement: React.FC<HeartElementProps> = ({
  wishQuantity,
  "data-testid": dataTestId,
}) => {
  return (
    <div className="relative" data-testid={dataTestId}>
      <Link href="/wishlist">
        <FaHeart className="text-2xl text-black" />
        <span className="block w-6 h-6 font-bold bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
          {wishQuantity}
        </span>
      </Link>
    </div>
  );
};

export default HeartElement;
