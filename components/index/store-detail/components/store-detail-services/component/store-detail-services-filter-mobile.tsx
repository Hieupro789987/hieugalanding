import { omit } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { ShopServiceCategory } from "../../../../../../lib/repo/services/shop-service-category.repo";
import { TitleDialog } from "../../../../../shared/dialog/title-dialog";
import { Button, Form, FormProps, Select } from "../../../../../shared/utilities/form";
import { Spinner } from "../../../../../shared/utilities/misc";
import { useStoreDetailServiceContext } from "../provider/store-detail-service-provider";
import { SORT_TYPES } from "./store-detail-services-filter";

export function StoreDetailServicesFilterMobile({
  categoryTags,
  ...props
}: FormProps & { categoryTags: ShopServiceCategory[] }) {
  const { onSubmit } = useStoreDetailServiceContext();

  const handleSubmit = () => {
    onSubmit();
    props.onClose();
  };

  return (
    <Form dialog onSubmit={handleSubmit} {...props}>
      <TitleDialog title="Bộ lọc" onClose={props.onClose} />
      <ServiceCheckboxGroupsMobile categoryTagList={categoryTags} />
      <Button primary className="w-full py-4 mt-4 h-14" text="Xác nhận" submit />
    </Form>
  );
}

export function ServiceCheckboxGroupsMobile({
  categoryTagList,
  ...props
}: {
  categoryTagList: ShopServiceCategory[];
}) {
  const [tags, setTags] = useState<ShopServiceCategory[]>();
  const [clickCategory, setClickCategory] = useState<string>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const { categoryTag, onFilterChange } = useStoreDetailServiceContext();
  const router = useRouter();
  const isLg = useScreen("lg");

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
      // setTags(categoryTagList);
    }
  }, [toggle]);

  if (tags == null || tags == undefined) return <Spinner />;

  return (
    <div className="mt-5">
      <>
        <div className="text-lg font-extrabold text-accent">Danh mục</div>
        <div className="grid items-start grid-cols-2 gap-2 mt-3 lg:justify-start lg:mt-2 lg:flex lg:flex-col ">
          {[
            {
              id: "",
              name: "Tất cả",
            },
            ...tags,
          ].map((tag, index) => (
            <Button
              unfocusable
              key={tag.id}
              text={tag.name}
              className={`lg:border-none border-gray-200 lg:[&>span]:ml-0 [&>span]:mx-auto ${
                (clickCategory == "" ? "" : clickCategory || categoryTag) == tag.id ||
                (!tag.id && (clickCategory == "" ? "" : !(clickCategory || categoryTag)))
                  ? `text-primary font-semibold  ${isLg ? "" : "border-primary"}`
                  : `text-accent ${isLg ? "" : "border-gray-200"}`
              } px-1 lg:w-full text-sm lg:text-base font-medium lg:font-medium justify-start border-2  rounded-b-md lg:text-left text-center`}
              onClick={() => {
                setClickCategory(tag.id);
                onFilterChange({ categoryTag: tag.id });
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
          searchable={false}
          defaultValue={"new"}
          options={SORT_TYPES}
          className="w-full mt-3 rounded-sm lg:border-none"
          value={router.query.sortBy || "latest"}
          onChange={(value) => onFilterChange({ sortBy: value })}
        />
      </div>
    </div>
  );
}
