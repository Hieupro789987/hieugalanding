import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useClickSearchOutside } from "../../../../lib/hooks/useClickSearchOutside";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ServiceTag } from "../../../../lib/repo/services/service-tag.repo";
import { SearchInput } from "../../../shared/common/search-input";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog";
import { Button, Checkbox, Select } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";

import { useServiceContext } from "../provider/services-provider";

import { ServicesFilterMobile } from "./services-filter-mobile";

export function ServicesFilter({ serviceTags, ...props }: { serviceTags: ServiceTag[] }) {
  const screenLg = useScreen("lg");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { countQuery } = useServiceContext();
  const { elementRef, openSearch, setOpenSearch, value, setValue } = useClickSearchOutside();

  return (
    <div className="flex flex-row justify-between w-full mt-1 mb-4 lg:justify-start lg:gap-3 lg:pr-2 lg:flex-col lg:w-60">
      <div className="lg:min-w-none w-[93%]">
        {openSearch ? (
          <div ref={elementRef}>
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
          {!openSearch && (
            <i className="text-2xl">
              <FiSearch onClick={() => setOpenSearch(true)} />
            </i>
          )}
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
          <ServiceCheckboxGroups serviceTagList={serviceTags} />
        </div>
      )}
      <ServicesFilterMobile
        serviceTags={serviceTags}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export function ServiceCheckboxGroups({
  serviceTagList,
  ...props
}: {
  serviceTagList: ServiceTag[];
}) {
  const toast = useToast();
  const [checks, setChecks] = useState<string[]>([]);
  const [tags, setTags] = useState<ServiceTag[]>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const { serviceTagIds, serviceTags } = useServiceContext();
  const router = useRouter();

  const toggleServiceTagId = (selected: boolean, serviceTagId: string) => {
    const newServiceTagIds = [...serviceTagIds];

    if (selected) {
      newServiceTagIds.push(serviceTagId);
    } else {
      newServiceTagIds.splice(newServiceTagIds.indexOf(serviceTagId), 1);
    }
    const { serviceTag, ...query } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...query,
          ...(newServiceTagIds.length ? { serviceTag: JSON.stringify(newServiceTagIds) } : {}),
        },
      },
      null,
      {
        shallow: true,
      }
    );
  };
  useEffect(() => {
    if (toggle) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setTags(serviceTagList);
      }, 300);
    } else {
      const newlist = [...serviceTagList?.slice(0, 5)];
      setTags(newlist);
    }
  }, [toggle]);

  return (
    <div className="mt-5">
      <div className="mb-4 font-extrabold">Loại dịch vụ</div>
      {tags?.map((serviceTag) => (
        <Checkbox
          key={serviceTag?.id}
          value={serviceTagIds?.includes(serviceTag?.id)}
          placeholder={serviceTag?.name}
          className="origin-left transform scale-90 lg:scale-100 hover:text-primary"
          controlClassName={`form-checkbox font-semibold hover:text-primary ${
            serviceTagIds.includes(serviceTag?.id) ? "text-primary" : ""
          }`}
          onChange={(selected) => {
            toggleServiceTagId(selected, serviceTag?.id);
          }}
        />
      ))}
      {serviceTagList?.length > 5 && (
        <Button
          textPrimary
          text={toggle && !loading ? "Thu gọn" : "Xem thêm"}
          icon={toggle ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
          iconClassName="font-extrabold text-2xl"
          iconPosition="end"
          className="px-0 pl-2 font-extrabold"
          unfocusable
          onClick={() => setToggle(!toggle)}
          isLoading={loading}
        />
      )}
      <div className="mt-3 mb-2 text-lg font-bold">Sắp xếp</div>
      <Select
        defaultValue={"new"}
        options={SORT_TYPES}
        menuPosition="absolute"
        className="w-full mt-3 rounded-sm lg:border-none"
        value={router.query.sortBy || "latest"}
        onChange={(value) => {
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              sortBy: value,
            },
          });
        }}
      />
    </div>
  );
}

function FiltersMobileDialog({
  serviceTags,
  ...props
}: DialogProps & { serviceTags: ServiceTag[] }) {
  const toast = useToast();
  return (
    <Dialog {...props} slideFromBottom="mobile-only">
      <Dialog.Body>
        <TitleDialog title="Lọc theo" onClose={props.onClose} />
        <ServiceCheckboxGroups serviceTagList={serviceTags} />
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
