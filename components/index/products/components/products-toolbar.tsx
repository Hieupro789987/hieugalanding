import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineFilter, HiOutlineSearch, HiOutlineSortDescending, HiX } from "react-icons/hi";
import { useClickSearchOutside } from "../../../../lib/hooks/useClickSearchOutside";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { SearchInput } from "../../../shared/common/search-input";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Slideout, SlideoutProps } from "../../../shared/utilities/dialog/slideout";
import { Button } from "../../../shared/utilities/form";
import { Scrollbar } from "../../../shared/utilities/misc";
import { SORT_TYPES, useProductsContext } from "../providers/products-provider";
import { ProductsTagList } from "./product-tag-list";
import { ProductsLocationList } from "./products-location-list";

export function ProductsToolbar() {
  const { sortBy } = useProductsContext();
  const screenLg = useScreen("lg");
  const router = useRouter();
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const { openSearch, setOpenSearch, elementRef, value, setValue } = useClickSearchOutside();

  if (screenLg) return <></>;
  return (
    <div className="flex items-center justify-end main-container">
      {/* <div className="flex items-center flex-1 overflow-x-auto divide-x no-scrollbar">
        {SORT_TYPES.map((type) => (
          <div
            key={type.value}
            className={`cursor-pointer px-3 whitespace-nowrap text-sm ${
              sortBy == type.value
                ? "font-bold text-primary"
                : "font-medium text-accent hover:text-accent-dark"
            }`}
            onClick={() => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  sortBy: type.value,
                },
              });
            }}
          >
            {type.label}
          </div>
        ))}
      </div> */}
      {openSearch && (
        <div className="w-full" ref={elementRef}>
          <SearchInput
            onValueChange={(val) => setValue(val.trim())}
            onClear={() => {
              if (!!value) {
                setOpenSearch(false);
                setValue("");
              }
            }}
          />
        </div>
      )}
      <div className="flex items-center px-2">
        {/* <Button
          className="px-2 opacity-75"
          iconClassName="text-xl"
          icon={<HiOutlineSortDescending />}
          onClick={() => setOpenSort(true)}
        /> */}
        {!openSearch && (
          <Button
            className="opacity-75 px-1"
            iconClassName="text-xl"
            icon={<HiOutlineSearch />}
            onClick={() => setOpenSearch(true)}
          />
        )}
        <Button
          className="opacity-75 px-1"
          iconClassName="text-xl"
          icon={<HiOutlineFilter />}
          onClick={() => setOpenFilter(true)}
        />
        {/* <ProductsSortSlideout isOpen={openSort} onClose={() => setOpenSort(false)} /> */}
        <ProductsFilterSlideout isOpen={openFilter} onClose={() => setOpenFilter(false)} />
      </div>
    </div>
  );
}

function ProductsSortSlideout({ ...props }: SlideoutProps) {
  const { sortBy } = useProductsContext();
  const router = useRouter();
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
          <div className="font-bold">Sắp xếp</div>
          <i>
            <HiX />
          </i>
        </div>
      </Dialog.Header>
      <div className="my-2">
        {SORT_TYPES.map((type) => (
          <div
            key={type.value}
            className={`cursor-pointer px-5 whitespace-nowrap flex items-center h-10 text-sm ${
              sortBy == type.value
                ? "font-bold text-primary"
                : "font-normal text-accent hover:text-accent-dark"
            }`}
            onClick={() => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  sortBy: type.value,
                },
              });
              props.onClose();
            }}
          >
            {type.label}
          </div>
        ))}
      </div>
    </Slideout>
  );
}

function ProductsFilterSlideout({ ...props }: SlideoutProps) {
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
        <ProductsTagList />
        {/* <ProductsLocationList /> */}
      </Scrollbar>
    </Slideout>
  );
}
