"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: any[];
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) {
        throw new Error("Failed to fetch merchants");
      }
      const data = await response.json();
      setMerchants(data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="flex h-screen" data-testid="merchant-page-container">
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="flex-1 p-10 overflow-y-auto">
        <div
          className="flex justify-between items-center mb-6"
          data-testid="page-header-container"
        >
          <h1 className="text-3xl font-bold" data-testid="merchants-title">
            Merchants
          </h1>
          <Link
            href="/admin/merchant/new"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            data-testid="add-merchant-link"
          >
            Add Merchant
          </Link>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6"
          data-testid="merchants-list-container"
        >
          {loading ? (
            <div className="text-center py-10" data-testid="loading-container">
              Loading merchants...
            </div>
          ) : merchants.length > 0 ? (
            <table className="w-full" data-testid="merchants-table">
              <thead data-testid="merchants-table-header">
                <tr
                  className="border-b"
                  data-testid="merchants-table-header-row"
                >
                  <th
                    className="py-3 text-left"
                    data-testid="merchant-name-header"
                  >
                    Name
                  </th>
                  <th
                    className="py-3 text-left"
                    data-testid="merchant-email-header"
                  >
                    Email
                  </th>
                  <th
                    className="py-3 text-left"
                    data-testid="merchant-status-header"
                  >
                    Status
                  </th>
                  <th
                    className="py-3 text-left"
                    data-testid="merchant-products-header"
                  >
                    Products
                  </th>
                  <th
                    className="py-3 text-left"
                    data-testid="merchant-actions-header"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-testid="merchants-table-body">
                {merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className="border-b hover:bg-gray-50"
                    data-testid={`merchant-row-${merchant.id}`}
                  >
                    <td
                      className="py-4"
                      data-testid={`merchant-name-${merchant.id}`}
                    >
                      {merchant.name}
                    </td>
                    <td
                      className="py-4"
                      data-testid={`merchant-email-${merchant.id}`}
                    >
                      {merchant.email || "N/A"}
                    </td>
                    <td
                      className="py-4"
                      data-testid={`merchant-status-${merchant.id}`}
                    >
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          merchant.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {merchant.status}
                      </span>
                    </td>
                    <td
                      className="py-4"
                      data-testid={`merchant-products-count-${merchant.id}`}
                    >
                      {merchant.products.length}
                    </td>
                    <td
                      className="py-4"
                      data-testid={`merchant-actions-${merchant.id}`}
                    >
                      <Link
                        href={`/admin/merchant/${merchant.id}`}
                        className="text-blue-500 hover:underline mr-3"
                        data-testid={`merchant-view-link-${merchant.id}`}
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/merchant/${merchant.id}`}
                        className="text-blue-500 hover:underline"
                        data-testid={`merchant-edit-link-${merchant.id}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="text-center py-10"
              data-testid="no-merchants-container"
            >
              No merchants found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
