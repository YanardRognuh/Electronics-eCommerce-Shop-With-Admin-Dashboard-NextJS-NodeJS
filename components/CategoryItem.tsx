// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
  "data-testid"?: string; // Tambahkan prop untuk data-testid
}

const CategoryItem = ({
  title,
  children,
  href,
  "data-testid": dataTestId,
}: CategoryItemProps) => {
  return (
    <Link href={href} data-testid={dataTestId}>
      <div
        className="flex flex-col items-center gap-y-2 cursor-pointer bg-white py-5 text-black hover:bg-gray-100"
        data-testid="category-item-content"
      >
        {children}

        <h3 className="font-semibold text-xl" data-testid="category-item-title">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
