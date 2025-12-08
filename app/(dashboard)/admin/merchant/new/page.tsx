"use client";
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

export default function NewMerchantPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Merchant name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post("/api/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create merchant");
      }

      const data = await response.json();
      toast.success("Merchant created successfully");
      router.push(`/admin/merchant/${data.id}`);
    } catch (error) {
      console.error("Error creating merchant:", error);
      toast.error("Failed to create merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen" data-testid="new-merchant-page-container">
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="flex-1 p-10 overflow-y-auto">
        <div
          className="flex justify-between items-center mb-6"
          data-testid="page-header-container"
        >
          <h1
            className="text-3xl font-bold"
            data-testid="add-new-merchant-title"
          >
            Add New Merchant
          </h1>
          <Link
            href="/admin/merchant"
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
            data-testid="cancel-link"
          >
            Cancel
          </Link>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6"
          data-testid="new-merchant-form-container"
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-testid="new-merchant-form"
          >
            <div data-testid="merchant-name-input-container">
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-name-label"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Merchant name"
                data-testid="merchant-name-input"
              />
            </div>
            <div data-testid="merchant-email-input-container">
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-email-label"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="email@example.com"
                data-testid="merchant-email-input"
              />
            </div>
            <div data-testid="merchant-phone-input-container">
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-phone-label"
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Phone number"
                data-testid="merchant-phone-input"
              />
            </div>
            <div data-testid="merchant-status-input-container">
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-status-label"
              >
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                data-testid="merchant-status-select"
              >
                <option value="ACTIVE" data-testid="status-option-active">
                  Active
                </option>
                <option value="INACTIVE" data-testid="status-option-inactive">
                  Inactive
                </option>
              </select>
            </div>
            <div
              className="md:col-span-2"
              data-testid="merchant-address-input-container"
            >
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-address-label"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Merchant address"
                data-testid="merchant-address-input"
              />
            </div>
            <div
              className="md:col-span-2"
              data-testid="merchant-description-input-container"
            >
              <label
                className="block text-gray-700 font-medium mb-2"
                data-testid="merchant-description-label"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 h-32"
                placeholder="Enter merchant description"
                data-testid="merchant-description-textarea"
              ></textarea>
            </div>
            <div className="md:col-span-2" data-testid="form-actions-container">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                data-testid="create-merchant-button"
              >
                {isSubmitting ? "Creating..." : "Create Merchant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
