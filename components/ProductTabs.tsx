// *********************
// Role of the component: Single product tabs on the single product page containing product description, main product info and reviews
// Name of the component: ProductTabs.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductTabs product={product} />
// Input parameters: { product: Product }
// Output: Single product tabs containing product description, main product info and reviews
// *********************

"use client";

import React, { useState } from "react";
// import RatingPercentElement from "./RatingPercentElement";
// import SingleReview from "./SingleReview";
import { formatCategoryName } from "@/utils/categoryFormating";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";

interface ProductTabsProps {
  "data-testid"?: string;
  product: Product;
}

const ProductTabs = ({
  "data-testid": dataTestId,
  product,
}: ProductTabsProps) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
    <div className="px-5 text-black" data-testid={dataTestId}>
      <div
        role="tablist"
        className="tabs tabs-bordered"
        data-testid="product-tabs-list"
      >
        <a
          role="tab"
          className={`tab text-lg text-black pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 0 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(0)}
          data-testid="product-description-tab"
        >
          Description
        </a>
        <a
          role="tab"
          className={`tab text-black text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 1 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(1)}
          data-testid="product-additional-info-tab"
        >
          Additional info
        </a>
      </div>
      <div className="pt-5" data-testid="product-tabs-content">
        {currentProductTab === 0 && (
          <div
            className="text-lg max-sm:text-base max-sm:text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(product?.description),
            }}
            data-testid="product-description-content"
          />
        )}

        {currentProductTab === 1 && (
          <div
            className="overflow-x-auto"
            data-testid="product-additional-info-content"
          >
            <table
              className="table text-xl text-center max-[500px]:text-base"
              data-testid="product-additional-info-table"
            >
              <tbody data-testid="product-additional-info-table-body">
                {/* row 1 */}
                <tr data-testid="product-manufacturer-row">
                  <th data-testid="product-manufacturer-label">
                    Manufacturer:
                  </th>
                  <td data-testid="product-manufacturer-value">
                    {sanitize(product?.manufacturer)}
                  </td>
                </tr>
                {/* row 2 */}
                <tr data-testid="product-category-row">
                  <th data-testid="product-category-label">Category:</th>
                  <td data-testid="product-category-value">
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : "No category"}
                  </td>
                </tr>
                {/* row 3 */}
                <tr data-testid="product-color-row">
                  <th data-testid="product-color-label">Color:</th>
                  <td data-testid="product-color-value">
                    Silver, LightSlateGray, Blue
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
