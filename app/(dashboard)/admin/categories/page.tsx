"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    apiClient
      .get("/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div
      className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4"
      data-testid="dashboard-category-container"
    >
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="w-full">
        <h1
          className="text-3xl font-semibold text-center mb-5"
          data-testid="all-categories-title"
        >
          All Categories
        </h1>
        <div
          className="flex justify-end mb-5"
          data-testid="add-category-button-container"
        >
          <Link
            href="/admin/categories/new"
            data-testid="add-new-category-link"
          >
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Add new category"
              data-testid="add-new-category-button"
            />
          </Link>
        </div>
        <div
          className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]"
          data-testid="categories-table-container"
        >
          <table
            className="table table-md table-pin-cols"
            data-testid="categories-table"
          >
            {/* head */}
            <thead data-testid="categories-table-header">
              <tr data-testid="categories-table-header-row">
                <th data-testid="categories-table-header-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      data-testid="categories-select-all-checkbox"
                    />
                  </label>
                </th>
                <th data-testid="categories-table-header-name">Name</th>
                <th data-testid="categories-table-header-actions"></th>
              </tr>
            </thead>
            <tbody data-testid="categories-table-body">
              {categories &&
                categories.map((category: Category) => (
                  <tr
                    key={nanoid()}
                    data-testid={`category-row-${category?.id}`}
                  >
                    <th data-testid={`category-checkbox-${category?.id}`}>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          data-testid={`category-select-checkbox-${category?.id}`}
                        />
                      </label>
                    </th>

                    <td data-testid={`category-name-cell-${category?.id}`}>
                      <div>
                        <p data-testid={`category-name-${category?.id}`}>
                          {formatCategoryName(category?.name)}
                        </p>
                      </div>
                    </td>

                    <th data-testid={`category-actions-cell-${category?.id}`}>
                      <Link
                        href={`/admin/categories/${category?.id}`}
                        className="btn btn-ghost btn-xs"
                        data-testid={`category-details-link-${category?.id}`}
                      >
                        details
                      </Link>
                    </th>
                  </tr>
                ))}
            </tbody>
            {/* foot */}
            <tfoot data-testid="categories-table-footer">
              <tr data-testid="categories-table-footer-row">
                <th data-testid="categories-table-footer-checkbox"></th>
                <th data-testid="categories-table-footer-name">Name</th>
                <th data-testid="categories-table-footer-actions"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
