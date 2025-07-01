"use client";

import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryDetail from "./sub-Child/page";
import { ParentCategoriesEnum } from "@modules/layout/components/new-side-menu";
import { TranslatedText } from "../translation/translated-text";

interface SubNavbarProps {
  categoriesData: HttpTypes.StoreProductCategory[];
}

export default function SubNavbar({ categoriesData }: SubNavbarProps) {
  const [allSubCategories, setAllSubCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState<HttpTypes.StoreProductCategory | null>(null);
  const [cacheCategories, setCacheCategories] = useState<
    Map<string, HttpTypes.StoreProductCategory[]>
  >(new Map());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [toggleState, setToggleState] = useState(false);

  const categories = [
    {
      handle: "women",
      name: "Women",
      parent_category_id: null,
    },
    {
      handle: "Men",
      name: "Men",
      parent_category_id: null,
    },
    {
      handle: "kids",
      name: "Kids",
      parent_category_id: null,
    },
    {
      handle: "life",
      name: "Life",
      parent_category_id: null,
    },
  ];

  useEffect(() => {
    const setCategory = () => {
      if (categoriesData) {
        const filterData = categoriesData.filter(
          (item) => item.parent_category?.handle == hoveredCategory
        );
        setAllSubCategories(filterData);
        const selected = categoriesData.find(
          (category: HttpTypes.StoreProductCategory) =>
            category.handle === hoveredCategory
        );
        setSelectedCategory(selected || null);
        const cache = new Map<string, HttpTypes.StoreProductCategory[]>();
        if (selected?.category_children) {
          selected.category_children.forEach(
            (child: HttpTypes.StoreProductCategory) => {
              const subcategories = categoriesData.filter(
                (category: HttpTypes.StoreProductCategory) =>
                  category.parent_category?.id === child.id
              );

              cache.set(child.id, subcategories);
            }
          );
        }
        setCacheCategories(cache);
      }
    };
    if (
      hoveredCategory === ParentCategoriesEnum.Kids ||
      hoveredCategory === ParentCategoriesEnum.Life ||
      hoveredCategory === ParentCategoriesEnum.Men ||
      hoveredCategory === ParentCategoriesEnum.Women
    ) {
      setCategory();
    }
  }, [hoveredCategory]);

  return (
    <div className='hidden md:block' onMouseLeave={() => setToggleState(false)}>
      <div className='flex h-full items-center justify-center w-full gap-3.5 text-center'>
        {categories.map(
          (category: Partial<HttpTypes.StoreProductCategory>, index) => {
            return (
              <div
                key={index}
                className='flex-shrink-0 whitespace-nowrap'
                onMouseEnter={() => {
                  //@ts-ignore
                  setHoveredCategory(category.handle);
                  setToggleState(true);
                }}
              >
                <Link
                  href={`/categories/${category.handle}`}
                  key={category.handle}
                  className={
                    category.handle === hoveredCategory ||
                    (category.category_children &&
                      category.category_children.find(
                        (child) => child.handle === hoveredCategory
                      ))
                      ? "font-bold underline"
                      : ""
                  }
                >
                  {category?.name ? (
                    <TranslatedText text={category?.name} />
                  ) : (
                    category?.name
                  )}
                </Link>
                <div>
                  <CategoryDetail
                    subCategory={allSubCategories}
                    SettoggleState={setToggleState}
                    toggle={toggleState}
                    parentName={category.name as string}
                    selectedCategory={hoveredCategory}
                    setHoveredCategory={setHoveredCategory}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
