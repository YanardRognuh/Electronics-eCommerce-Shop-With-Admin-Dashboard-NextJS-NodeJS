// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient
      .get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <div className="w-full" data-testid="dashboard-product-table-container">
      <h1
        className="text-3xl font-semibold text-center mb-5"
        data-testid="product-table-title"
      >
        All products
      </h1>
      <div
        className="flex justify-end mb-5"
        data-testid="product-table-actions"
      >
        <Link href="/admin/products/new" data-testid="add-new-product-link">
          <CustomButton
            buttonType="button"
            customWidth="110px"
            paddingX={10}
            paddingY={5}
            textSize="base"
            text="Add new product"
            data-testid="add-new-product-button"
          />
        </Link>
      </div>

      <div
        className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full max-h-[80vh]"
        data-testid="product-table-wrapper"
      >
        <table
          className="table table-md table-pin-cols"
          data-testid="product-data-table"
        >
          {/* head */}
          <thead data-testid="product-table-thead">
            <tr>
              <th data-testid="select-all-header">
                <label data-testid="select-all-label">
                  <input
                    type="checkbox"
                    className="checkbox"
                    data-testid="select-all-checkbox"
                  />
                </label>
              </th>
              <th data-testid="product-name-header">Product</th>
              <th data-testid="stock-status-header">Stock Availability</th>
              <th data-testid="price-header">Price</th>
              <th data-testid="actions-header"></th>
            </tr>
          </thead>
          <tbody data-testid="product-table-tbody">
            {/* row 1 */}
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} data-testid={`product-row-${product.id}`}>
                  <th data-testid={`product-select-cell-${product.id}`}>
                    <label data-testid={`product-select-label-${product.id}`}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        data-testid={`product-select-checkbox-${product.id}`}
                      />
                    </label>
                  </th>

                  <td data-testid={`product-info-cell-${product.id}`}>
                    <div
                      className="flex items-center gap-3"
                      data-testid={`product-details-${product.id}`}
                    >
                      <div
                        className="avatar"
                        data-testid={`product-avatar-container-${product.id}`}
                      >
                        <div
                          className="mask mask-squircle w-12 h-12"
                          data-testid={`product-image-wrapper-${product.id}`}
                        >
                          <Image
                            width={48}
                            height={48}
                            src={
                              product?.mainImage
                                ? `/${product?.mainImage}`
                                : "/product_placeholder.jpg"
                            }
                            alt={sanitize(product?.title) || "Product image"}
                            className="w-auto h-auto"
                            data-testid={`product-image-${product.id}`}
                          />
                        </div>
                      </div>
                      <div data-testid={`product-text-info-${product.id}`}>
                        <div
                          className="font-bold"
                          data-testid={`product-title-${product.id}`}
                        >
                          {sanitize(product?.title)}
                        </div>
                        <div
                          className="text-sm opacity-50"
                          data-testid={`product-manufacturer-${product.id}`}
                        >
                          {sanitize(product?.manufacturer)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td data-testid={`stock-status-cell-${product.id}`}>
                    {product?.inStock ? (
                      <span
                        className="badge badge-success text-white badge-sm"
                        data-testid={`stock-badge-${product.id}`}
                      >
                        In stock
                      </span>
                    ) : (
                      <span
                        className="badge badge-error text-white badge-sm"
                        data-testid={`stock-badge-${product.id}`}
                      >
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td data-testid={`price-cell-${product.id}`}>
                    ${product?.price}
                  </td>
                  <th data-testid={`action-cell-${product.id}`}>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="btn btn-ghost btn-xs"
                      data-testid={`view-details-link-${product.id}`}
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))
            ) : (
              <tr data-testid="no-products-row">
                <td colSpan={5} data-testid="no-products-message">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
          {/* foot */}
          <tfoot data-testid="product-table-tfoot">
            <tr>
              <th data-testid="footer-select-all"></th>
              <th data-testid="footer-product-name">Product</th>
              <th data-testid="footer-stock-status">Stock Availability</th>
              <th data-testid="footer-price">Price</th>
              <th data-testid="footer-actions"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductTable;
