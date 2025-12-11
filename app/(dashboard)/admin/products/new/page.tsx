"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const addProduct = async () => {
    if (
      !product.merchantId ||
      product.title === "" ||
      product.manufacturer === "" ||
      product.description == "" ||
      product.slug === ""
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedProduct = sanitizeFormData(product);

      console.log("Sending product data:", sanitizedProduct);

      // Correct usage of apiClient.post
      const response = await apiClient.post(`/api/products`, sanitizedProduct);

      if (response.status === 201) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        toast.success("Product added successfully");
        setProduct({
          merchantId: "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        toast.error(`"Error:" ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: Merchant[] = await res.json();
      setMerchants(data || []);
      setProduct((prev) => ({
        ...prev,
        merchantId: prev.merchantId || data?.[0]?.id || "",
      }));
    } catch (e) {
      toast.error("Failed to load merchants");
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("File upload unsuccessfull");
      }
    } catch (error) {
      console.error("Error happend while sending request:", error);
    }
  };

  const fetchCategories = async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setProduct({
          merchantId: product.merchantId || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: data[0]?.id,
        });
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, []);

  return (
    <div
      className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5"
      data-testid="add-new-product-container"
    >
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1
          className="text-3xl font-semibold"
          data-testid="add-new-product-title"
        >
          Add new product
        </h1>
        <div data-testid="merchant-select-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="merchant-label">
                Merchant Info:
              </span>
            </div>
            <select
              className="select select-bordered"
              value={product?.merchantId}
              onChange={(e) =>
                setProduct({ ...product, merchantId: e.target.value })
              }
              data-testid="merchant-select"
            >
              {merchants.map((merchant) => (
                <option
                  key={merchant.id}
                  value={merchant.id}
                  data-testid={`merchant-option-${merchant.id}`}
                >
                  {merchant.name}
                </option>
              ))}
            </select>
            {merchants.length === 0 && (
              <span
                className="text-xs text-red-500 mt-1"
                data-testid="no-merchants-warning"
              >
                Please create a merchant first.
              </span>
            )}
          </label>
        </div>

        <div data-testid="product-name-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="product-name-label">
                Product name:
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              data-testid="product-name-input"
            />
          </label>
        </div>

        <div data-testid="product-slug-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="product-slug-label">
                Product slug:
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
              data-testid="product-slug-input"
            />
          </label>
        </div>

        <div data-testid="product-category-select-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="product-category-label">
                Category:
              </span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
              data-testid="product-category-select"
            >
              {categories &&
                categories.map((category: any) => (
                  <option
                    key={category?.id}
                    value={category?.id}
                    data-testid={`category-option-${category?.id}`}
                  >
                    {category?.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div data-testid="product-price-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="product-price-label">
                Product price:
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              data-testid="product-price-input"
            />
          </label>
        </div>
        <div data-testid="product-manufacturer-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span
                className="label-text"
                data-testid="product-manufacturer-label"
              >
                Manufacturer:
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
              data-testid="product-manufacturer-input"
            />
          </label>
        </div>
        <div data-testid="product-instock-select-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="product-instock-label">
                Is product in stock?
              </span>
            </div>
            <select
              className="select select-bordered"
              value={product?.inStock}
              onChange={(e) =>
                setProduct({ ...product, inStock: Number(e.target.value) })
              }
              data-testid="product-instock-select"
            >
              <option value={1} data-testid="instock-option-yes">
                Yes
              </option>
              <option value={0} data-testid="instock-option-no">
                No
              </option>
            </select>
          </label>
        </div>
        <div data-testid="main-image-upload-container">
          <input
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e: any) => {
              uploadFile(e.target.files[0]);
              setProduct({ ...product, mainImage: e.target.files[0].name });
            }}
            data-testid="main-image-upload-input"
          />
          {product?.mainImage && (
            <Image
              src={`/` + product?.mainImage}
              alt={product?.title}
              className="w-auto h-auto"
              width={100}
              height={100}
              data-testid="main-image-preview"
            />
          )}
        </div>
        <div data-testid="product-description-input-container">
          <label className="form-control">
            <div className="label">
              <span
                className="label-text"
                data-testid="product-description-label"
              >
                Product description:
              </span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              data-testid="product-description-textarea"
            ></textarea>
          </label>
        </div>
        <div
          className="flex gap-x-2"
          data-testid="add-product-button-container"
        >
          <button
            onClick={addProduct}
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            data-testid="add-product-button"
          >
            Add product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
