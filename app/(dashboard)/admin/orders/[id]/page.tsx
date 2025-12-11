"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(`/api/orders/${params?.id}`);
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(`/api/order-product/${params?.id}`);
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name.length > 0 &&
      order?.lastname.length > 0 &&
      order?.phone.length > 0 &&
      order?.email.length > 0 &&
      order?.company.length > 0 &&
      order?.adress.length > 0 &&
      order?.apartment.length > 0 &&
      order?.city.length > 0 &&
      order?.country.length > 0 &&
      order?.postalCode.length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("You entered invalid name format");
        return;
      }

      if (!isValidNameOrLastname(order?.lastname)) {
        toast.error("You entered invalid lastname format");
        return;
      }

      if (!isValidEmailAddressFormat(order?.email)) {
        toast.error("You entered invalid email format");
        return;
      }

      apiClient
        .put(`/api/orders/${order?.id}`, {
          method: "PUT", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Order updated successfuly");
          } else {
            throw Error("There was an error while updating a order");
          }
        })
        .catch((error) =>
          toast.error("There was an error while updating a order")
        );
    } else {
      toast.error("Please fill all fields");
    }
  };

  const deleteOrder = async () => {
    const requestOptions = {
      method: "DELETE",
    };

    apiClient
      .delete(`/api/order-product/${order?.id}`, requestOptions)
      .then((response) => {
        apiClient
          .delete(`/api/orders/${order?.id}`, requestOptions)
          .then((response) => {
            toast.success("Order deleted successfully");
            router.push("/admin/orders");
          });
      });
  };

  return (
    <div
      className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5"
      data-testid="admin-single-order-container"
    >
      <DashboardSidebar data-testid="dashboard-sidebar" />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1
          className="text-3xl font-semibold"
          data-testid="order-details-title"
        >
          Order details
        </h1>
        <div className="mt-5" data-testid="order-id-container">
          <label className="w-full">
            <div data-testid="order-id-display">
              <span className="text-xl font-bold" data-testid="order-id-label">
                Order ID:
              </span>
              <span className="text-base" data-testid="order-id-value">
                {" "}
                {order?.id}
              </span>
            </div>
          </label>
        </div>
        <div
          className="flex gap-x-2 max-sm:flex-col"
          data-testid="name-lastname-container"
        >
          <div data-testid="name-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="name-label">
                  Name:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
                data-testid="name-input"
              />
            </label>
          </div>
          <div data-testid="lastname-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="lastname-label">
                  Lastname:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.lastname}
                onChange={(e) =>
                  setOrder({ ...order, lastname: e.target.value })
                }
                data-testid="lastname-input"
              />
            </label>
          </div>
        </div>

        <div data-testid="phone-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="phone-label">
                Phone number:
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.phone}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
              data-testid="phone-input"
            />
          </label>
        </div>

        <div data-testid="email-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="email-label">
                Email adress:
              </span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={order?.email}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
              data-testid="email-input"
            />
          </label>
        </div>

        <div data-testid="company-input-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="company-label">
                Company (optional):
              </span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.company}
              onChange={(e) => setOrder({ ...order, company: e.target.value })}
              data-testid="company-input"
            />
          </label>
        </div>

        <div
          className="flex gap-x-2 max-sm:flex-col"
          data-testid="address-apartment-container"
        >
          <div data-testid="address-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="address-label">
                  Address:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.adress}
                onChange={(e) => setOrder({ ...order, adress: e.target.value })}
                data-testid="address-input"
              />
            </label>
          </div>

          <div data-testid="apartment-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="apartment-label">
                  Apartment, suite, etc. :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.apartment}
                onChange={(e) =>
                  setOrder({ ...order, apartment: e.target.value })
                }
                data-testid="apartment-input"
              />
            </label>
          </div>
        </div>

        <div
          className="flex gap-x-2 max-sm:flex-col"
          data-testid="city-country-postal-container"
        >
          <div data-testid="city-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="city-label">
                  City:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.city}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
                data-testid="city-input"
              />
            </label>
          </div>

          <div data-testid="country-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="country-label">
                  Country:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.country}
                onChange={(e) =>
                  setOrder({ ...order, country: e.target.value })
                }
                data-testid="country-input"
              />
            </label>
          </div>

          <div data-testid="postal-code-input-container">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text" data-testid="postal-code-label">
                  Postal Code:
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.postalCode}
                onChange={(e) =>
                  setOrder({ ...order, postalCode: e.target.value })
                }
                data-testid="postal-code-input"
              />
            </label>
          </div>
        </div>

        <div data-testid="order-status-container">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text" data-testid="order-status-label">
                Order status
              </span>
            </div>
            <select
              className="select select-bordered"
              value={order?.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as
                    | "processing"
                    | "delivered"
                    | "canceled",
                })
              }
              data-testid="order-status-select"
            >
              <option value="processing" data-testid="status-processing">
                Processing
              </option>
              <option value="delivered" data-testid="status-delivered">
                Delivered
              </option>
              <option value="canceled" data-testid="status-canceled">
                Canceled
              </option>
            </select>
          </label>
        </div>
        <div data-testid="order-notice-container">
          <label className="form-control">
            <div className="label">
              <span className="label-text" data-testid="order-notice-label">
                Order notice:
              </span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={order?.orderNotice || ""}
              onChange={(e) =>
                setOrder({ ...order, orderNotice: e.target.value })
              }
              data-testid="order-notice-textarea"
            ></textarea>
          </label>
        </div>
        <div data-testid="order-products-and-actions-container">
          {orderProducts?.map((product) => (
            <div
              className="flex items-center gap-x-4"
              key={product?.id}
              data-testid={`order-product-${product?.id}`}
            >
              <Image
                src={
                  product?.product?.mainImage
                    ? `/${product?.product?.mainImage}`
                    : "/product_placeholder.jpg"
                }
                alt={product?.product?.title}
                width={50}
                height={50}
                className="w-auto h-auto"
                data-testid={`order-product-image-${product?.id}`}
              />
              <div data-testid={`order-product-info-${product?.id}`}>
                <Link
                  href={`/product/${product?.product?.slug}`}
                  data-testid={`order-product-link-${product?.id}`}
                >
                  {product?.product?.title}
                </Link>
                <p data-testid={`order-product-price-${product?.id}`}>
                  ${product?.product?.price} * {product?.quantity} items
                </p>
              </div>
            </div>
          ))}
          <div
            className="flex flex-col gap-y-2 mt-10"
            data-testid="order-total-container"
          >
            <p className="text-2xl" data-testid="order-subtotal">
              Subtotal: ${order?.total}
            </p>
            <p className="text-2xl" data-testid="order-tax">
              Tax 20%: ${order?.total / 5}
            </p>
            <p className="text-2xl" data-testid="order-shipping">
              Shipping: $5
            </p>
            <p className="text-3xl font-semibold" data-testid="order-total">
              Total: ${order?.total + order?.total / 5 + 5}
            </p>
          </div>
          <div
            className="flex gap-x-2 max-sm:flex-col mt-5"
            data-testid="order-actions-container"
          >
            <button
              type="button"
              className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
              onClick={updateOrder}
              data-testid="update-order-button"
            >
              Update order
            </button>
            <button
              type="button"
              className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
              onClick={deleteOrder}
              data-testid="delete-order-button"
            >
              Delete order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
