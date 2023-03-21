import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { ServiceTag } from "../../../../lib/repo/services/service-tag.repo";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { Button, Checkbox, Form, FormProps, Select } from "../../../shared/utilities/form";
import { useServiceContext } from "../provider/services-provider";
import { SORT_TYPES } from "./services-filter";

export function ServicesFilterMobile({
  serviceTags,
  ...props
}: FormProps & { serviceTags: ServiceTag[] }) {
  const { onSubmit } = useServiceContext();

  const handleSubmit = () => {
    onSubmit();
    props.onClose();
  };

  return (
    <Form dialog onSubmit={handleSubmit} {...props}>
      <TitleDialog title="Bộ lọc" onClose={props.onClose} />
      <ServiceCheckboxGroupsMobile serviceTagList={serviceTags} />
      <Button primary className="w-full py-4 mt-4 h-14" text="Xác nhận" submit />
    </Form>
  );
}

export function ServiceCheckboxGroupsMobile({
  serviceTagList,
  ...props
}: {
  serviceTagList: ServiceTag[];
}) {
  const [checks, setChecks] = useState<string[]>([]);
  const [tags, setTags] = useState<ServiceTag[]>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const { serviceTagIds, serviceTags, tagIds, onFilterChange } = useServiceContext();

  const router = useRouter();

  const toggleServiceTagId = (selected: boolean, serviceTagId: string) => {
    const newServiceTagIds = [...tagIds];

    if (selected) {
      newServiceTagIds.push(serviceTagId);
    } else {
      newServiceTagIds.splice(newServiceTagIds.indexOf(serviceTagId), 1);
    }

    onFilterChange({
      serviceTag: newServiceTagIds.length > 0 ? JSON.stringify(newServiceTagIds) : [],
    });
  };
  useEffect(() => {
    if (toggle) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setTags(serviceTagList);
      }, 300);
    } else {
      const newServiceList = [...serviceTagList];
      const newlist = [...newServiceList?.slice(0, 5)];
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
        searchable={false}
        defaultValue={"new"}
        options={SORT_TYPES}
        className="w-full mt-3 rounded-sm lg:border-none"
        value={router.query.sortBy || "latest"}
        onChange={(value) => onFilterChange({ sortBy: value })}
      />
    </div>
  );
}
