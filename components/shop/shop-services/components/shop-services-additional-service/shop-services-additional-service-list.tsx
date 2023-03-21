import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine, RiDeleteBin7Line } from "react-icons/ri";
import { AdditionalService } from "../../../../../lib/repo/services/additional-service.repo";
import { Button, Field, Input } from "../../../../shared/utilities/form";
import { PartLabel } from "../shop-services-form";
import { ShopServicesAdditionalServiceItemSettingList } from "./shop-services-additional-service-item-setting-list";
import { ShopServicesAdditionalServiceOptionList } from "./shop-services-additional-service-option-list";

interface ShopServiceAdditionalServiceListProps extends ReactProps {}

export function ShopServiceAdditionalServiceList({
  ...props
}: ShopServiceAdditionalServiceListProps) {
  const name = "additionalServices";
  const { fields, append, remove } = useFieldArray({ name, keyName: "key" });
  const additionalServiceList = fields as ({ key: string } & AdditionalService)[];

  return (
    <div className="col-span-12">
      <PartLabel text="dịch vụ đi kèm" />
      {!additionalServiceList?.length ? (
        <></>
      ) : (
        <div className="gap-3 flex-cols">
          {additionalServiceList.map((service, index) => (
            <AdditionalServiceItem
              key={service.key}
              index={index}
              name={`${name}.${index}`}
              service={service}
              remove={remove}
            />
          ))}
        </div>
      )}

      <div className="col-span-12 mt-3">
        <div className="border-2 border-dotted rounded border-slate-400 w-fit hover:border-primary">
          <Button
            icon={<RiAddLine />}
            iconClassName="text-xl"
            text="Thêm dịch vụ đi kèm"
            className="border-none"
            onClick={() => append({ name: "" })}
          />
        </div>
      </div>
    </div>
  );
}

interface AdditionalServiceItemProps extends ReactProps {
  index: number;
  name: string;
  service: AdditionalService;
  remove: (index: number) => void;
}

function AdditionalServiceItem({
  index,
  name,
  service,
  remove,
  ...props
}: AdditionalServiceItemProps) {
  const { register } = useFormContext();

  register(`${name}._id`, { value: service.id });

  return (
    <div className="grid grid-cols-12 p-5 pb-2 bg-gray-100 rounded gap-x-5">
      <Field
        cols={5}
        label="Tên dịch vụ"
        name={`${name}.name`}
        errorClassName="w-72"
        labelClassName="text-accent"
        required
      >
        <Input placeholder="Nhập tên dịch vụ..." />
      </Field>
      <div className="col-span-7 text-right">
        <Button
          icon={<RiDeleteBin7Line />}
          iconClassName={"text-2xl text-gray-400 hover:text-danger"}
          tooltip="Xóa"
          className="px-0"
          onClick={() => remove(index)}
        />
      </div>
      <ShopServicesAdditionalServiceOptionList parentName={`${name}`} />
      <ShopServicesAdditionalServiceItemSettingList name={`${name}`} />
    </div>
  );
}
