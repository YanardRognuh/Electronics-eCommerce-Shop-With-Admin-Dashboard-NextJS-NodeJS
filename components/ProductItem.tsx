// ProductItem.tsx
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { sanitize } from "@/lib/sanitize";

interface ProductItemProps {
  product: Product;
  color: string;
  "data-testid"?: string;
}

const ProductItem = ({
  product,
  color,
  "data-testid": testId,
}: ProductItemProps) => {
  return (
    <div
      className="flex flex-col items-center gap-y-2"
      data-testid={testId || `product-item-${product.id}`}
    >
      <Link
        href={`/product/${product.slug}`}
        data-testid={`product-image-link-${product.id}`}
      >
        <Image
          src={
            product.mainImage
              ? `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="100vw"
          className="w-auto h-[300px]"
          alt={sanitize(product?.title) || "Product image"}
          data-testid={`product-image-${product.id}`}
        />
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className={
          color === "black"
            ? `text-xl text-black font-normal mt-2 uppercase`
            : `text-xl text-white font-normal mt-2 uppercase`
        }
        data-testid={`product-title-link-${product.id}`}
      >
        {sanitize(product.title)}
      </Link>
      <p
        className={
          color === "black"
            ? "text-lg text-black font-semibold"
            : "text-lg text-white font-semibold"
        }
        data-testid={`product-price-${product.id}`}
      >
        ${product.price}
      </p>

      <Link
        href={`/product/${product?.slug}`}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
        data-testid={`view-product-link-${product.id}`}
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
