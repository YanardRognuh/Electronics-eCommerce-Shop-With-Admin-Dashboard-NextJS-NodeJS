// *********************
// Role of the component: Bulk upload products page for admin dashboard
// Name of the component: BulkUpload.tsx
// Developer: Aleksandar Kuzmanovic (modified)
// Version: 1.0
// Component call: <BulkUpload />
// Input parameters: no input parameters
// Output: bulk upload page for admin dashboard
// *********************

"use client";
import { DashboardSidebar } from "@/components";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaFileUpload,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Products uploaded successfully!",
          details: data.details,
        });
        toast.success("Bulk upload completed!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed",
          details: data.details,
        });
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error occurred during upload",
      });
      toast.error("Network error occurred");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Sample Product,99.99,Sample Manufacturer,10,https://example.com/image.jpg  ,Sample description,sample-product,category-uuid
Another Product,149.99,Another Manufacturer,5,https://example.com/image2.jpg  ,Another description,another-product,category-uuid`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <div
      className="flex xl:flex-row flex-col justify-start items-start"
      data-testid="bulk-upload-page-container"
    >
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="w-full xl:p-14 p-4">
        <h1
          className="text-4xl font-bold mb-8"
          data-testid="bulk-upload-page-title"
        >
          Bulk Upload Products
        </h1>

        {/* Instructions */}
        <div
          className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6"
          data-testid="instructions-container"
        >
          <h2
            className="text-lg font-semibold mb-2 text-blue-800"
            data-testid="instructions-heading"
          >
            📋 Instructions
          </h2>
          <ul
            className="list-disc list-inside space-y-1 text-sm text-blue-700"
            data-testid="instructions-list"
          >
            <li data-testid="instruction-download-template">
              Download the CSV template below
            </li>
            <li data-testid="instruction-fill-data">
              Fill in your product data (title, price, manufacturer, stock,
              image URL, description, slug, categoryId)
            </li>
            <li data-testid="instruction-upload-file">
              Upload the completed CSV file
            </li>
            <li data-testid="instruction-max-size">Maximum file size: 5MB</li>
          </ul>
        </div>

        {/* Download Template Button */}
        <div className="mb-6" data-testid="template-download-section">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            data-testid="download-template-button"
          >
            <FaDownload /> Download CSV Template
          </button>
        </div>

        {/* File Upload Area */}
        <div className="mb-6" data-testid="file-upload-section">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            data-testid="file-upload-drop-area"
          >
            <FaFileUpload
              className="text-6xl text-gray-400 mx-auto mb-4"
              data-testid="file-upload-icon"
            />
            <p className="text-lg mb-2" data-testid="file-upload-text">
              {file ? (
                <span
                  className="font-semibold text-blue-600"
                  data-testid="selected-file-info"
                >
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
              ) : (
                "Drag and drop CSV file here, or click to select"
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              data-testid="file-upload-input"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer transition-colors"
              data-testid="file-upload-label"
            >
              Select CSV File
            </label>
          </div>
        </div>

        {/* Upload Button */}
        {file && (
          <div className="mb-6" data-testid="upload-button-section">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-colors ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              data-testid="upload-products-button"
            >
              {uploading ? (
                <span
                  className="flex items-center justify-center gap-2"
                  data-testid="upload-progress-indicator"
                >
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Products"
              )}
            </button>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div
            className={`border-l-4 p-6 rounded-lg ${
              uploadResult.success
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
            data-testid="upload-result-container"
          >
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <FaCheckCircle
                  className="text-3xl text-green-500 flex-shrink-0 mt-1"
                  data-testid="success-icon"
                />
              ) : (
                <FaTimesCircle
                  className="text-3xl text-red-500 flex-shrink-0 mt-1"
                  data-testid="error-icon"
                />
              )}
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    uploadResult.success ? "text-green-800" : "text-red-800"
                  }`}
                  data-testid="upload-result-status"
                >
                  {uploadResult.success
                    ? "✅ Upload Successful!"
                    : "❌ Upload Failed"}
                </h3>
                <p
                  className={`mb-3 ${
                    uploadResult.success ? "text-green-700" : "text-red-700"
                  }`}
                  data-testid="upload-result-message"
                >
                  {uploadResult.message}
                </p>

                {uploadResult.details && (
                  <div
                    className="bg-white rounded p-4 space-y-2"
                    data-testid="upload-statistics-container"
                  >
                    <p
                      className="font-semibold"
                      data-testid="statistics-heading"
                    >
                      Upload Statistics:
                    </p>
                    <div
                      className="grid grid-cols-3 gap-4"
                      data-testid="statistics-grid"
                    >
                      <div
                        className="text-center"
                        data-testid="processed-count-container"
                      >
                        <p
                          className="text-2xl font-bold text-blue-600"
                          data-testid="processed-count-value"
                        >
                          {uploadResult.details.processed}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          data-testid="processed-count-label"
                        >
                          Processed
                        </p>
                      </div>
                      <div
                        className="text-center"
                        data-testid="successful-count-container"
                      >
                        <p
                          className="text-2xl font-bold text-green-600"
                          data-testid="successful-count-value"
                        >
                          {uploadResult.details.successful}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          data-testid="successful-count-label"
                        >
                          Successful
                        </p>
                      </div>
                      <div
                        className="text-center"
                        data-testid="failed-count-container"
                      >
                        <p
                          className="text-2xl font-bold text-red-600"
                          data-testid="failed-count-value"
                        >
                          {uploadResult.details.failed}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          data-testid="failed-count-label"
                        >
                          Failed
                        </p>
                      </div>
                    </div>

                    {uploadResult.details.errors &&
                      uploadResult.details.errors.length > 0 && (
                        <div className="mt-4" data-testid="errors-container">
                          <p
                            className="font-semibold text-red-700 mb-2"
                            data-testid="errors-heading"
                          >
                            Errors:
                          </p>
                          <ul
                            className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto"
                            data-testid="errors-list"
                          >
                            {uploadResult.details.errors.map((error, index) => (
                              <li
                                key={index}
                                data-testid={`error-item-${index}`}
                              >
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CSV Format Guide */}
        <div
          className="mt-8 bg-gray-50 rounded-lg p-6"
          data-testid="csv-format-guide-container"
        >
          <h2
            className="text-2xl font-bold mb-4"
            data-testid="csv-format-guide-heading"
          >
            📝 CSV Format Guide
          </h2>
          <div
            className="overflow-x-auto"
            data-testid="csv-format-table-container"
          >
            <table
              className="min-w-full bg-white border border-gray-300 text-sm"
              data-testid="csv-format-table"
            >
              <thead data-testid="csv-format-table-header">
                <tr
                  className="bg-gray-100"
                  data-testid="csv-format-table-header-row"
                >
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    data-testid="csv-column-header"
                  >
                    Column
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    data-testid="csv-required-header"
                  >
                    Required
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    data-testid="csv-type-header"
                  >
                    Type
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    data-testid="csv-description-header"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody data-testid="csv-format-table-body">
                <tr data-testid="csv-format-table-row-title">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-title"
                  >
                    title
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-title"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-title"
                  >
                    String
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-title"
                  >
                    Product name
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-price">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-price"
                  >
                    price
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-price"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-price"
                  >
                    Number
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-price"
                  >
                    Product price (e.g., 99.99)
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-manufacturer">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-manufacturer"
                  >
                    manufacturer
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-manufacturer"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-manufacturer"
                  >
                    String
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-manufacturer"
                  >
                    Manufacturer/Brand name
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-instock">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-instock"
                  >
                    inStock
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-instock"
                  >
                    ❌ No
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-instock"
                  >
                    Number
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-instock"
                  >
                    Stock quantity (default: 0)
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-mainimage">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-mainimage"
                  >
                    mainImage
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-mainimage"
                  >
                    ❌ No
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-mainimage"
                  >
                    URL
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-mainimage"
                  >
                    Product image URL
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-description">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-description"
                  >
                    description
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-description"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-description"
                  >
                    String
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-description"
                  >
                    Product description
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-slug">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-slug"
                  >
                    slug
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-slug"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-slug"
                  >
                    String
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-slug"
                  >
                    URL-friendly identifier
                  </td>
                </tr>
                <tr data-testid="csv-format-table-row-categoryid">
                  <td
                    className="border border-gray-300 px-4 py-2 font-mono"
                    data-testid="csv-column-categoryid"
                  >
                    categoryId
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-required-categoryid"
                  >
                    ✅ Yes
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-type-categoryid"
                  >
                    UUID
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    data-testid="csv-description-categoryid"
                  >
                    Category ID from database
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload History */}
        <div className="mt-8" data-testid="upload-history-container">
          <BulkUploadHistory data-testid="bulk-upload-history-component" />
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
