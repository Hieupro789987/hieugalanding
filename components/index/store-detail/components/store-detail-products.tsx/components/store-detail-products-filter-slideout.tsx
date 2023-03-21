import { useRouter } from "next/router";
import { useEffect } from "react";
import { HiX } from "react-icons/hi";
import { Category } from "../../../../../../lib/repo/category.repo";
import { Dialog, Slideout, SlideoutProps } from "../../../../../shared/utilities/dialog";
import { Scrollbar } from "../../../../../shared/utilities/misc";
import { StoreDetailProductsFilter } from "./store-detail-products-filter";
import { StoreDetailProductsSort } from "./store-detail-products-sort";

export function StoreDetailProductsFilterSlideout({
  categories,
  productTag,
  ...props
}: SlideoutProps & { categories: Category[]; productTag: string }) {
  const router = useRouter();

  useEffect(() => {
    props.onClose();
  }, [router.query]);

  return (
    <Slideout
      width="75vw"
      minWidth="280px"
      maxWidth="320px"
      headerClass=""
      hasCloseButton={false}
      {...props}
    >
      <Dialog.Header>
        <div
          className="flex items-center justify-between px-4 border-b h-14 text-accent"
          onClick={props.onClose}
        >
          <div className="font-bold">Bộ lọc</div>
          <i>
            <HiX />
          </i>
        </div>
      </Dialog.Header>
      <Scrollbar innerClassName="p-4" height={"calc(100vh - 56px)"}>
        <StoreDetailProductsFilter categories={categories} productTag={productTag} />
        <StoreDetailProductsSort />
      </Scrollbar>
    </Slideout>
  );
}
