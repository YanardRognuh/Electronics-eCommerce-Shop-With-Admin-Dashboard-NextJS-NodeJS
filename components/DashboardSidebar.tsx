// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div
      className="xl:w-[400px] bg-blue-500 h-full max-xl:w-full"
      data-testid="dashboard-sidebar-container"
    >
      <Link href="/admin" data-testid="sidebar-dashboard-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-dashboard-item"
        >
          <MdDashboard className="text-2xl" data-testid="dashboard-icon" />{" "}
          <span className="font-normal" data-testid="dashboard-label">
            Dashboard
          </span>
        </div>
      </Link>
      <Link href="/admin/orders" data-testid="sidebar-orders-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-orders-item"
        >
          <FaBagShopping className="text-2xl" data-testid="orders-icon" />{" "}
          <span className="font-normal" data-testid="orders-label">
            Orders
          </span>
        </div>
      </Link>
      <Link href="/admin/products" data-testid="sidebar-products-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-products-item"
        >
          <FaTable className="text-2xl" data-testid="products-icon" />{" "}
          <span className="font-normal" data-testid="products-label">
            Products
          </span>
        </div>
      </Link>
      <Link href="/admin/bulk-upload" data-testid="sidebar-bulk-upload-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-bulk-upload-item"
        >
          <FaFileUpload className="text-2xl" data-testid="bulk-upload-icon" />{" "}
          <span className="font-normal" data-testid="bulk-upload-label">
            Bulk Upload
          </span>
        </div>
      </Link>
      <Link href="/admin/categories" data-testid="sidebar-categories-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-categories-item"
        >
          <MdCategory className="text-2xl" data-testid="categories-icon" />{" "}
          <span className="font-normal" data-testid="categories-label">
            Categories
          </span>
        </div>
      </Link>
      <Link href="/admin/users" data-testid="sidebar-users-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-users-item"
        >
          <FaRegUser className="text-2xl" data-testid="users-icon" />{" "}
          <span className="font-normal" data-testid="users-label">
            Users
          </span>
        </div>
      </Link>
      <Link href="/admin/merchant" data-testid="sidebar-merchant-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-merchant-item"
        >
          <FaStore className="text-2xl" data-testid="merchant-icon" />{" "}
          <span className="font-normal" data-testid="merchant-label">
            Merchant
          </span>
        </div>
      </Link>
      <Link href="/admin/settings" data-testid="sidebar-settings-link">
        <div
          className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white"
          data-testid="sidebar-settings-item"
        >
          <FaGear className="text-2xl" data-testid="settings-icon" />{" "}
          <span className="font-normal" data-testid="settings-label">
            Settings
          </span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;
