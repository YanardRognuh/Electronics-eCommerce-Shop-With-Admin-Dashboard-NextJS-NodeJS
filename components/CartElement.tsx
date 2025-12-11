// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from "next/link";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useProductStore } from "@/app/_zustand/store";

interface CartElementProps {
  "data-testid"?: string; // ← TAMBAHKAN INI
}

const CartElement = ({
  "data-testid": dataTestId, // ← TAMBAHKAN INI
}: CartElementProps) => {
  const { allQuantity } = useProductStore();
  return (
    <div className="relative" data-testid={dataTestId}>
      <Link href="/cart" data-testid="cart-link">
        <FaCartShopping
          className="text-2xl text-black"
          data-testid="cart-icon"
        />
        <span
          className="block w-6 h-6 bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]"
          data-testid="cart-quantity-badge"
        >
          {allQuantity}
        </span>
      </Link>
    </div>
  );
};

export default CartElement;
