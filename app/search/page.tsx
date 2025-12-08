import { ProductItem, SectionTitle } from "@/components";
import apiClient from "@/lib/api";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// Tidak perlu interface Props
const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) => {
  const sp = await searchParams; // sekarang aman
  let products = [];

  try {
    const data = await apiClient.get(`/api/search?query=${sp?.search || ""}`);
    if (!data.ok) {
      console.error("Failed to fetch search results:", data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    products = [];
  }

  return (
    <div data-testid="search-page-container">
      <SectionTitle
        title="Search Page"
        path="Home | Search"
        data-testid="search-page-title"
      />
      <div className="max-w-screen-2xl mx-auto">
        {sp?.search && (
          <h3
            className="text-4xl text-center py-10 max-sm:text-3xl"
            data-testid="search-results-heading"
          >
            Showing results for {sanitize(sp?.search)}
          </h3>
        )}
        <div
          className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1"
          data-testid="search-results-grid"
        >
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem
                key={product.id}
                product={product}
                color="black"
                data-testid={`search-product-item-${product.id}`}
              />
            ))
          ) : (
            <h3
              className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg"
              data-testid="no-products-message"
            >
              No products found for specified query
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
