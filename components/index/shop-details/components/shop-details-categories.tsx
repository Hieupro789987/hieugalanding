import { useEffect, useMemo, useRef, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { ProductCard } from "../../../shared/product/product-card";
import { Spinner } from "../../../shared/utilities/misc";
import { TabScroller } from "../../../shared/utilities/tab/tab-scroller";
import { useShopDetailsContext } from "../providers/shop-details-provider";
interface ShopCategoriesPropsType extends ReactProps {}

export function ShopDetailsCategories(props: ShopCategoriesPropsType) {
  return (
    <div className="bg-white">
      <ListCategory />
    </div>
  );
}

var disableScrollCheck = false;
var disableTimout;
function ListCategory(props) {
  const { categories } = useShopDetailsContext();
  const { selectedBranch } = useShopContext();

  const [currentInViewportTab, setCurrentInViewportTab] = useState("");
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const scrollEvent = () => {
    if (disableScrollCheck || !categories) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setCurrentInViewportTab(categories[categories.length - 1].id);
      return;
    }
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const el = document.getElementById(`tab-item-${category.id}`);
      if (el && isInViewport(el)) {
        setCurrentInViewportTab(categories[i].id);
        return;
      }
    }
    setCurrentInViewportTab(categories?.length ? categories[0].id : "");
  };

  useEffect(() => {
    if (categories) {
      document.addEventListener("scroll", scrollEvent, {
        passive: true,
      });
    }
    return () => {
      document.removeEventListener("scroll", scrollEvent);
    };
  }, [categories]);

  const filteredCategories: Category[] = useMemo(() => {
    let tempCategories = [];
    if (categories && selectedBranch) {
      categories.forEach((cat) => {
        let filteredProducts = cat.products.filter(
          (item) =>
            (item.allowSale && item.branchIds?.length == 0) ||
            item.branchIds?.find((id) => id == selectedBranch.id)
        );
        if (filteredProducts.length) {
          tempCategories.push({
            ...cat,
            products: filteredProducts,
            productIds: filteredProducts.map((item) => item.id),
          });
        }
      });
    }
    return tempCategories;
  }, [categories, selectedBranch]);

  const categoriesOptions = useMemo(
    () => filteredCategories.map((x) => ({ value: x.id, label: x.name })),
    [filteredCategories]
  );

  if (!categories || !filteredCategories) return <Spinner />;

  return (
    <>
      <TabScroller
        value={currentInViewportTab}
        onChange={(val) => {
          const el = document.getElementById(`tab-item-${val}`);
          if (el) {
            clearTimeout(disableTimout);
            disableScrollCheck = true;
            scrollTo({
              top: (el.offsetParent as HTMLElement).offsetTop + el.offsetTop,
              behavior: "smooth",
            });
            disableTimout = setTimeout(() => {
              disableScrollCheck = false;
            }, 1000);
          }
        }}
        options={categoriesOptions}
        className="sticky z-50 max-w-lg text-sm bg-white border-t border-b md:text-base top-12"
        tabClassName="px-4 py-3 whitespace-nowrap font-semibold text-gray-800 hover:text-primary border-solid cursor-pointer"
        activeTabClassName="text-primary hover:text-primary-dark"
        dividerClassName="absolute top-1/2 transform -translate-y-1/2 h-3/5 border-r-2 border-gray-300 right-0"
      />
      <div className="flex flex-col bg-gray-100">
        {filteredCategories.map((item: Category, index: number) => (
          <ShopCategory id={item.id} products={item.products} title={item.name} key={index} />
        ))}
      </div>
    </>
  );
}

interface ShopCategoryPropsType extends ReactProps {
  products: Product[];
  title: string;
  id: string;
}
function ShopCategory(props: ShopCategoryPropsType) {
  const ref = useRef();

  return (
    <div className="relative px-4 pt-4 bg-gray-100 menu">
      <div ref={ref} className="absolute -top-8" id={`tab-item-${props.id}`}></div>
      <div className="font-semibold menu-title text-md md:text-lg text-accent">{props.title}</div>
      {!!props.products.length && (
        <div className="flex flex-col gap-3 mt-3">
          {props.products.map(
            (item: Product, index: number) =>
              !!item.allowSale && (
                <ProductCard
                  key={index}
                  product={item}
                  hasQuantityButtons
                  hasLabel
                  className="bg-white border-b rounded-md shadow-sm"
                />
              )
          )}
        </div>
      )}
    </div>
  );
}
