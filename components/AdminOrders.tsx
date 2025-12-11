"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiClient.get("/api/orders");
      const data = await response.json();

      setOrders(data?.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div
      className="xl:ml-5 w-full max-xl:mt-5 "
      data-testid="admin-orders-container"
    >
      <h1
        className="text-3xl font-semibold text-center mb-5"
        data-testid="all-orders-title"
      >
        All orders
      </h1>
      <div className="overflow-x-auto" data-testid="orders-table-container">
        <table
          className="table table-md table-pin-cols"
          data-testid="orders-table"
        >
          {/* head */}
          <thead data-testid="orders-table-header">
            <tr data-testid="orders-table-header-row">
              <th data-testid="orders-table-header-checkbox">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    data-testid="orders-select-all-checkbox"
                  />
                </label>
              </th>
              <th data-testid="orders-table-header-order-id">Order ID</th>
              <th data-testid="orders-table-header-name-country">
                Name and country
              </th>
              <th data-testid="orders-table-header-status">Status</th>
              <th data-testid="orders-table-header-subtotal">Subtotal</th>
              <th data-testid="orders-table-header-date">Date</th>
              <th data-testid="orders-table-header-actions"></th>
            </tr>
          </thead>
          <tbody data-testid="orders-table-body">
            {/* row 1 */}
            {orders &&
              orders.length > 0 &&
              orders.map((order) => (
                <tr key={order?.id} data-testid={`order-row-${order?.id}`}>
                  <th data-testid={`order-checkbox-${order?.id}`}>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        data-testid={`order-select-checkbox-${order?.id}`}
                      />
                    </label>
                  </th>

                  <td data-testid={`order-id-cell-${order?.id}`}>
                    <div>
                      <p
                        className="font-bold"
                        data-testid={`order-id-${order?.id}`}
                      >
                        #{order?.id}
                      </p>
                    </div>
                  </td>

                  <td data-testid={`order-name-country-cell-${order?.id}`}>
                    <div className="flex items-center gap-5">
                      <div>
                        <div
                          className="font-bold"
                          data-testid={`order-name-${order?.id}`}
                        >
                          {order?.name}
                        </div>
                        <div
                          className="text-sm opacity-50"
                          data-testid={`order-country-${order?.id}`}
                        >
                          {order?.country}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td data-testid={`order-status-cell-${order?.id}`}>
                    <span
                      className="badge badge-success text-white badge-sm"
                      data-testid={`order-status-${order?.id}`}
                    >
                      {order?.status}
                    </span>
                  </td>

                  <td data-testid={`order-subtotal-cell-${order?.id}`}>
                    <p data-testid={`order-subtotal-${order?.id}`}>
                      ${order?.total}
                    </p>
                  </td>

                  <td data-testid={`order-date-${order?.id}`}>
                    {new Date(Date.parse(order?.dateTime)).toDateString()}
                  </td>
                  <th data-testid={`order-actions-cell-${order?.id}`}>
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="btn btn-ghost btn-xs"
                      data-testid={`order-details-link-${order?.id}`}
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot data-testid="orders-table-footer">
            <tr data-testid="orders-table-footer-row">
              <th data-testid="orders-table-footer-checkbox"></th>
              <th data-testid="orders-table-footer-order-id">Order ID</th>
              <th data-testid="orders-table-footer-name-country">
                Name and country
              </th>
              <th data-testid="orders-table-footer-status">Status</th>
              <th data-testid="orders-table-footer-subtotal">Subtotal</th>
              <th data-testid="orders-table-footer-date">Date</th>
              <th data-testid="orders-table-footer-actions"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
