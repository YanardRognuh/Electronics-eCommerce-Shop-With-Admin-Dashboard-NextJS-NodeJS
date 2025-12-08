// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  // getting current page number from Zustand store
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    // setting URL params and after that putting them all in URL
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page]);

  return (
    <div data-testid="filters-container">
      <h3 className="text-2xl mb-2" data-testid="filters-title">
        Filters
      </h3>
      <div className="divider"></div>
      <div className="flex flex-col gap-y-1" data-testid="availability-filters">
        <h3 className="text-xl mb-2" data-testid="availability-title">
          Availability
        </h3>
        <div className="form-control" data-testid="in-stock-filter-control">
          <label
            className="cursor-pointer flex items-center"
            data-testid="in-stock-filter-label"
          >
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox"
              data-testid="in-stock-checkbox"
            />
            <span
              className="label-text text-lg ml-2 text-black"
              data-testid="in-stock-label"
            >
              In stock
            </span>
          </label>
        </div>

        <div className="form-control" data-testid="out-of-stock-filter-control">
          <label
            className="cursor-pointer flex items-center"
            data-testid="out-of-stock-filter-label"
          >
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox"
              data-testid="out-of-stock-checkbox"
            />
            <span
              className="label-text text-lg ml-2 text-black"
              data-testid="out-of-stock-label"
            >
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1" data-testid="price-filters">
        <h3 className="text-xl mb-2" data-testid="price-title">
          Price
        </h3>
        <div data-testid="price-range-container">
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
            data-testid="price-range-slider"
          />
          <span data-testid="price-range-value">{`Max price: $${inputCategory.priceFilter.value}`}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div data-testid="rating-filters">
        <h3 className="text-xl mb-2" data-testid="rating-title">
          Minimum Rating:
        </h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info"
          step="1"
          data-testid="rating-range-slider"
        />
        <div
          className="w-full flex justify-between text-xs px-2"
          data-testid="rating-range-labels"
        >
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
