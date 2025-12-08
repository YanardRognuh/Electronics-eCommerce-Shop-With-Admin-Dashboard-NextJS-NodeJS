import {
  StockAvailabillity,
  UrgencyText,
  ProductTabs,
  SingleProductDynamicFields,
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string; id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(`/api/slugs/${paramsAwaited?.productSlug}`);
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(`/api/images/${paramsAwaited?.id}`);
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-white" data-testid="single-product-page-container">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div data-testid="product-images-container">
            <Image
              src={
                product?.mainImage
                  ? `/${product?.mainImage}`
                  : "/product_placeholder.jpg"
              }
              width={500}
              height={500}
              alt="main image"
              className="w-auto h-auto"
              data-testid="product-main-image"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
              {images?.map((imageItem: ImageItem, key: number) => (
                <Image
                  key={imageItem.imageID + key}
                  src={`/${imageItem.image}`}
                  width={100}
                  height={100}
                  alt="laptop image"
                  className="w-auto h-auto"
                  data-testid={`product-additional-image-${key}`}
                />
              ))}
            </div>
          </div>
          <div
            className="flex flex-col gap-y-7 text-black max-[500px]:text-center"
            data-testid="product-details-container"
          >
            <h1 className="text-3xl" data-testid="product-title">
              {sanitize(product?.title)}
            </h1>
            <p className="text-xl font-semibold" data-testid="product-price">
              ${product?.price}
            </p>
            <StockAvailabillity
              stock={94}
              inStock={product?.inStock}
              data-testid="product-stock-availability"
            />
            <SingleProductDynamicFields
              product={product}
              data-testid="product-dynamic-fields"
            />
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
              <p className="text-lg" data-testid="product-sku">
                SKU: <span className="ml-1">abccd-18</span>
              </p>
              <div className="text-lg flex gap-x-2">
                <span>Share:</span>
                <div className="flex items-center gap-x-1 text-2xl">
                  <FaSquareFacebook data-testid="share-facebook" />
                  <FaSquareXTwitter data-testid="share-twitter" />
                  <FaSquarePinterest data-testid="share-pinterest" />
                </div>
              </div>
              <div
                className="flex gap-x-2"
                data-testid="payment-methods-container"
              >
                <Image
                  src="/visa.svg"
                  width={50}
                  height={50}
                  alt="visa icon"
                  className="w-auto h-auto"
                  data-testid="payment-visa"
                />
                <Image
                  src="/mastercard.svg"
                  width={50}
                  height={50}
                  alt="mastercard icon"
                  className="h-auto w-auto"
                  data-testid="payment-mastercard"
                />
                <Image
                  src="/ae.svg"
                  width={50}
                  height={50}
                  alt="americal express icon"
                  className="h-auto w-auto"
                  data-testid="payment-american-express"
                />
                <Image
                  src="/paypal.svg"
                  width={50}
                  height={50}
                  alt="paypal icon"
                  className="w-auto h-auto"
                  data-testid="payment-paypal"
                />
                <Image
                  src="/dinersclub.svg"
                  width={50}
                  height={50}
                  alt="diners club icon"
                  className="h-auto w-auto"
                  data-testid="payment-diners-club"
                />
                <Image
                  src="/discover.svg"
                  width={50}
                  height={50}
                  alt="discover icon"
                  className="h-auto w-auto"
                  data-testid="payment-discover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} data-testid="product-tabs" />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
