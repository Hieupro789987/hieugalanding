import { omit } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useClickSearchOutside } from "../../../../../../lib/hooks/useClickSearchOutside";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { useToast } from "../../../../../../lib/providers/toast-provider";
import { ServiceTag } from "../../../../../../lib/repo/services/service-tag.repo";
import { ShopServiceCategory } from "../../../../../../lib/repo/services/shop-service-category.repo";
import { SearchInput } from "../../../../../shared/common/search-input";
import { TitleDialog } from "../../../../../shared/dialog/title-dialog";
import { useQuestionsContext } from "../../../../../shared/question/providers/questions-provider";
import { Dialog, DialogProps } from "../../../../../shared/utilities/dialog";
import { Button, Checkbox, Form, FormProps, Select } from "../../../../../shared/utilities/form";
import { Spinner } from "../../../../../shared/utilities/misc";

import { useStoreDetailServiceContext } from "../provider/store-detail-service-provider";
import { StoreDetailServicesFilterMobile } from "./store-detail-services-filter-mobile";

export function StoreDetailServicesFilter({
  categoryTags,
  ...props
}: {
  categoryTags: ShopServiceCategory[];
}) {
  const screenLg = useScreen("lg");
  const [open, setOpen] = useState(false);

  const { countQuery } = useStoreDetailServiceContext();
  const { elementRef, openSearch, setOpenSearch, value, setValue } = useClickSearchOutside();

  return (
    <div className="flex flex-row justify-between w-full mt-3 mb-4 lg:justify-start lg:gap-3 lg:pr-2 lg:flex-col lg:w-60">
      <div className="lg:min-w-none w-[93%]">
        {openSearch ? (
          <div ref={elementRef} className="mt-2">
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
        ) : (
          <span className="text-2xl font-extrabold">Dịch vụ</span>
        )}
      </div>

      {!screenLg && (
        <div className="flex flex-row items-center gap-x-2">
          {!openSearch && <FiSearch size={24} onClick={() => setOpenSearch(true)} />}
          <div className="relative">
            <i
              className={`text-2xl ${countQuery > 0 ? "text-primary" : ""}`}
              onClick={() => {
                setOpen(true);
              }}
            >
              <BiFilterAlt />
            </i>

            {countQuery > 0 && (
              <div className="absolute top-0 z-20 w-2 h-2 p-1 border-2 border-white rounded-full bg-danger left-3 lg:left-6"></div>
            )}
          </div>
        </div>
      )}

      {screenLg && (
        <div className="">
          <ServiceCheckboxGroups categoryTagList={categoryTags} />
        </div>
      )}
      {/* <FiltersMobileDialog
        categoryTags={categoryTags}
        isOpen={open}
        onClose={() => setOpen(false)}
      /> */}
      {/* <FormFilterBodyMobile
        categoryTags={categoryTags}
        isOpen={open}
        onClose={() => setOpen(false)}
      /> */}

      <StoreDetailServicesFilterMobile
        categoryTags={categoryTags}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export function ServiceCheckboxGroups({
  categoryTagList,
  ...props
}: {
  categoryTagList: ShopServiceCategory[];
}) {
  const [tags, setTags] = useState<ShopServiceCategory[]>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const { categoryTag } = useStoreDetailServiceContext();
  const router = useRouter();

  useEffect(() => {
    if (toggle) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setTags(categoryTagList);
      }, 300);
    } else {
      const newlist = [...categoryTagList?.slice(0, 5)];
      setTags(newlist);
    }
  }, [toggle]);

  if (tags == null || tags == undefined) return <Spinner />;

  return (
    <div className="mt-5">
      <>
        <div className="text-lg font-extrabold text-accent">Danh mục</div>
        <div className="flex flex-col items-start justify-start mt-2">
          {[
            {
              id: "",
              name: "Tất cả",
            },
            ...tags,
          ].map((tag, index) => (
            <Button
              key={tag.id}
              text={tag.name}
              className={`${
                categoryTag == tag.id || (!tag.id && !categoryTag)
                  ? "text-primary font-semibold"
                  : "text-accent"
              } px-1 w-full text-sm lg:text-base font-medium lg:font-medium justify-start`}
              href={{
                pathname: router.pathname,
                query: {
                  ...omit(router.query, ["categoryTag"]),
                  ...(tag.id ? { categoryTag: tag.id } : {}),
                },
              }}
            />
          ))}
        </div>

        {categoryTagList.length > 5 && (
          <Button
            textPrimary
            text={toggle && !loading ? "Thu gọn" : "Xem thêm"}
            icon={toggle ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            iconClassName="font-extrabold text-2xl"
            iconPosition="end"
            className="px-0 pl-1 font-extrabold"
            unfocusable
            onClick={() => setToggle(!toggle)}
            isLoading={loading}
          />
        )}
      </>

      <div className="pl-1">
        <div className="mt-3 mb-2 text-lg font-bold ">Sắp xếp</div>
        <Select
          defaultValue={"new"}
          options={SORT_TYPES}
          className="w-full mt-3 rounded-sm lg:border-none"
          value={router.query.sortBy || "latest"}
          onChange={(value) => {
            router.replace({
              pathname: router.pathname,
              query: {
                ...router.query,
                sortBy: value,
              },
            });
          }}
        />
      </div>
    </div>
  );
}

function FiltersMobileDialog({
  categoryTags,
  ...props
}: DialogProps & { categoryTags: ShopServiceCategory[] }) {
  const toast = useToast();
  return (
    <Dialog {...props} slideFromBottom="mobile-only">
      <Dialog.Body>
        <TitleDialog title="Lọc theo" onClose={props.onClose} />
        <ServiceCheckboxGroups categoryTagList={categoryTags} />
        <Button
          primary
          className="w-full py-4 mt-4 h-14"
          text="Xác nhận"
          onClick={() => toast.info("Tính năng đang phát triển")}
        />
      </Dialog.Body>
    </Dialog>
  );
}

export type SortType = "latest" | "priceAsc" | "priceDesc";
export const SORT_TYPES: Option<SortType>[] = [
  {
    value: "latest",
    label: "Mới nhất",
  },

  {
    value: "priceAsc",
    label: "Giá thấp nhất",
  },
  {
    value: "priceDesc",
    label: "Giá cao nhất",
  },
];
