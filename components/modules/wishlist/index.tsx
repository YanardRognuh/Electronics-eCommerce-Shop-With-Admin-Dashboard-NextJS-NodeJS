"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
// import WishItem from "@/components/WishItem";  // ❌ Nonaktifkan sementara
import apiClient from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const WishlistModule = () => {
  const { data: session, status } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlistByUserId = async (id: string) => {
    try {
      const response = await apiClient.get(`/api/wishlist/${id}`, {
        cache: "no-store",
      });
      const wishlistData = await response.json();

      const productArray = wishlistData.map((item: any) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      }));

      setWishlist(productArray);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      try {
        const response = await apiClient.get(
          `/api/users/email/${session.user.email}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        getWishlistByUserId(data?.id);
      } catch (error) {
        console.error("Failed to fetch user by email:", error);
      }
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);

  return (
    <>
      {wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <tr key={item.id}>
                    <td>Placeholder</td>
                    <td>{item.title}</td>
                    <td>
                      {item.stockAvailabillity ? "In Stock" : "Out of Stock"}
                    </td>
                    <td>Actions disabled (wishlist UI incomplete)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
