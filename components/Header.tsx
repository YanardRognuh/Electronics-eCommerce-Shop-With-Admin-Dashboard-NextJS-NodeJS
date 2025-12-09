// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string;
      stockAvailabillity: number;
    }[] = [];

    return; // temporary disable wishlist fetching while the issue is being resolved

    wishlist.map((item: any) =>
      productArray.push({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      })
    );

    setWishlist(productArray);
  };

  // getting user by email so I can get his user id
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

  return (
    <header className="bg-white" data-testid="header-container">
      <HeaderTop data-testid="header-top-component" />
      {pathname.startsWith("/admin") === false && (
        <div
          className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto"
          data-testid="public-header-content"
        >
          <Link href="/" data-testid="logo-link">
            <img
              src="/logo v1 svg.svg"
              width={300}
              height={300}
              alt="singitronic logo"
              className="relative right-5 max-[1023px]:w-56"
              data-testid="public-logo"
            />
          </Link>
          <SearchInput data-testid="search-input-component" />
          <div
            className="flex gap-x-10 items-center"
            data-testid="public-header-icons-container"
          >
            <NotificationBell data-testid="notification-bell-component" />
            <HeartElement
              wishQuantity={wishQuantity}
              data-testid="heart-element-component"
            />
            <CartElement data-testid="cart-element-component" />
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div
          className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5"
          data-testid="admin-header-content"
        >
          <Link href="/" data-testid="admin-logo-link">
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-56 h-auto"
              data-testid="admin-logo"
            />
          </Link>
          <div
            className="flex gap-x-5 items-center"
            data-testid="admin-header-icons-container"
          >
            <NotificationBell />
            <div
              className="dropdown dropdown-end"
              data-testid="admin-user-dropdown"
            >
              <div
                tabIndex={0}
                role="button"
                className="w-10"
                data-testid="admin-user-profile-trigger"
              >
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                  data-testid="admin-user-profile-image"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                data-testid="admin-user-dropdown-menu"
              >
                <li data-testid="admin-dashboard-menu-item">
                  <Link href="/admin" data-testid="admin-dashboard-link">
                    Dashboard
                  </Link>
                </li>
                <li data-testid="admin-profile-menu-item">
                  <a data-testid="admin-profile-link">Profile</a>
                </li>
                <li onClick={handleLogout} data-testid="admin-logout-menu-item">
                  <a href="#" data-testid="admin-logout-link">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
