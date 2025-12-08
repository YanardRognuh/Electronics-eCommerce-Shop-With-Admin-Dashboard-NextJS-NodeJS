"use client";

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {
  const { products, removeFromCart, calculateTotals, total } =
    useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };
  return (
    <form
      className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
      data-testid="cart-module-form"
    >
      <section
        aria-labelledby="cart-heading"
        className="lg:col-span-7"
        data-testid="cart-items-section"
      >
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        <ul
          role="list"
          className="divide-y divide-gray-200 border-b border-t border-gray-200"
          data-testid="cart-items-list"
        >
          {products.map((product) => (
            <li
              key={product.id}
              className="flex py-6 sm:py-10"
              data-testid={`cart-item-${product.id}`}
            >
              <div
                className="flex-shrink-0"
                data-testid={`cart-item-image-container-${product.id}`}
              >
                <Image
                  width={192}
                  height={192}
                  src={
                    product?.image
                      ? `/${product.image}`
                      : "/product_placeholder.jpg"
                  }
                  alt="laptop image"
                  className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                  data-testid={`cart-item-image-${product.id}`}
                />
              </div>

              <div
                className="ml-4 flex flex-1 flex-col justify-between sm:ml-6"
                data-testid={`cart-item-details-${product.id}`}
              >
                <div
                  className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0"
                  data-testid={`cart-item-content-${product.id}`}
                >
                  <div data-testid={`cart-item-info-${product.id}`}>
                    <div className="flex justify-between">
                      <h3
                        className="text-sm"
                        data-testid={`cart-item-title-container-${product.id}`}
                      >
                        <Link
                          href={`#`}
                          className="font-medium text-gray-700 hover:text-gray-800"
                          data-testid={`cart-item-title-link-${product.id}`}
                        >
                          {sanitize(product.title)}
                        </Link>
                      </h3>
                    </div>
                    {/* <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{product.color}</p>
                        {product.size ? (
                          <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{product.size}</p>
                        ) : null}
                      </div> */}
                    <p
                      className="mt-1 text-sm font-medium text-gray-900"
                      data-testid={`cart-item-price-${product.id}`}
                    >
                      ${product.price}
                    </p>
                  </div>

                  <div
                    className="mt-4 sm:mt-0 sm:pr-9"
                    data-testid={`cart-item-actions-${product.id}`}
                  >
                    <QuantityInputCart
                      product={product}
                      data-testid={`quantity-input-cart-${product.id}`}
                    />
                    <div
                      className="absolute right-0 top-0"
                      data-testid={`cart-item-remove-container-${product.id}`}
                    >
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        type="button"
                        className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        data-testid={`remove-item-button-${product.id}`}
                      >
                        <span className="sr-only">Remove</span>
                        <FaXmark
                          className="h-5 w-5"
                          aria-hidden="true"
                          data-testid={`remove-item-icon-${product.id}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <p
                  className="mt-4 flex space-x-2 text-sm text-gray-700"
                  data-testid={`cart-item-stock-status-${product.id}`}
                >
                  {1 ? (
                    <FaCheck
                      className="h-5 w-5 flex-shrink-0 text-green-500"
                      aria-hidden="true"
                      data-testid={`stock-status-icon-${product.id}`}
                    />
                  ) : (
                    <FaClock
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      aria-hidden="true"
                      data-testid={`stock-status-icon-${product.id}`}
                    />
                  )}

                  <span data-testid={`stock-status-text-${product.id}`}>
                    {1 ? "In stock" : `Ships in 3 days`}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        data-testid="order-summary-section"
      >
        <h2
          id="summary-heading"
          className="text-lg font-medium text-gray-900"
          data-testid="order-summary-title"
        >
          Order summary
        </h2>

        <dl className="mt-6 space-y-4" data-testid="order-summary-details">
          <div
            className="flex items-center justify-between"
            data-testid="subtotal-row"
          >
            <dt className="text-sm text-gray-600" data-testid="subtotal-label">
              Subtotal
            </dt>
            <dd
              className="text-sm font-medium text-gray-900"
              data-testid="subtotal-amount"
            >
              ${total}
            </dd>
          </div>
          <div
            className="flex items-center justify-between border-t border-gray-200 pt-4"
            data-testid="shipping-estimate-row"
          >
            <dt
              className="flex items-center text-sm text-gray-600"
              data-testid="shipping-estimate-label"
            >
              <span>Shipping estimate</span>
              <a
                href="#"
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                data-testid="shipping-estimate-info-link"
              >
                <span className="sr-only">
                  Learn more about how shipping is calculated
                </span>
                <FaCircleQuestion
                  className="h-5 w-5"
                  aria-hidden="true"
                  data-testid="shipping-estimate-info-icon"
                />
              </a>
            </dt>
            <dd
              className="text-sm font-medium text-gray-900"
              data-testid="shipping-estimate-amount"
            >
              $5.00
            </dd>
          </div>
          <div
            className="flex items-center justify-between border-t border-gray-200 pt-4"
            data-testid="tax-estimate-row"
          >
            <dt
              className="flex text-sm text-gray-600"
              data-testid="tax-estimate-label"
            >
              <span>Tax estimate</span>
              <a
                href="#"
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                data-testid="tax-estimate-info-link"
              >
                <span className="sr-only">
                  Learn more about how tax is calculated
                </span>
                <FaCircleQuestion
                  className="h-5 w-5"
                  aria-hidden="true"
                  data-testid="tax-estimate-info-icon"
                />
              </a>
            </dt>
            <dd
              className="text-sm font-medium text-gray-900"
              data-testid="tax-estimate-amount"
            >
              ${total / 5}
            </dd>
          </div>
          <div
            className="flex items-center justify-between border-t border-gray-200 pt-4"
            data-testid="order-total-row"
          >
            <dt
              className="text-base font-medium text-gray-900"
              data-testid="order-total-label"
            >
              Order total
            </dt>
            <dd
              className="text-base font-medium text-gray-900"
              data-testid="order-total-amount"
            >
              ${total === 0 ? 0 : Math.round(total + total / 5 + 5)}
            </dd>
          </div>
        </dl>
        {products.length > 0 && (
          <div className="mt-6" data-testid="checkout-section">
            <Link
              href="/checkout"
              className="block flex justify-center items-center w-full uppercase bg-white px-4 py-3 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
              data-testid="checkout-link"
            >
              <span>Checkout</span>
            </Link>
          </div>
        )}
      </section>
    </form>
  );
};
