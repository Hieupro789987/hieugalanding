import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import { Spec } from "../../../../lib/repo/specs-template.repo";
import { Button, Field, FormProps, Input, Label } from "../../../shared/utilities/form";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface ShopProductSpecificationDetailsDialogProps extends FormProps {}

export function ShopProductSpecificationDetailsDialog({
  ...props
}: ShopProductSpecificationDetailsDialogProps) {
  return (
    <DataTable.Form grid width={600}>
      <Field name="name" label="Tên mẫu thông số sản phẩm" required className="w-11/12">
        <Input autoFocus />
      </Field>
      <SpecificationList />
    </DataTable.Form>
  );
}

interface SpecificationListProps extends ReactProps {}

export function SpecificationList({ ...props }: SpecificationListProps) {
  const name = "specs";
  const { fields, remove, append } = useFieldArray({ name });
  const specificationList = fields as ({ id: string } & Spec)[];

  useEffect(() => {
    if (!fields?.length) append({ value: "" });
  }, [fields]);

  return (
    <>
      <Label text="Chi tiết thông số" className="col-span-12" required />
      <div className="flex flex-col col-span-12 gap-2">
        {specificationList.map((specification, index) => (
          <div key={specification.id} className="flex justify-between gap-2">
            <Field name={`${name}.${index}.name`} className="w-11/12 grow-0 shrink-0" required>
              <Input />
            </Field>
            {index > 0 && (
              <Button
                unfocusable
                icon={<RiCloseLine />}
                iconClassName="text-xl"
                hoverDanger
                className="pr-0"
                onClick={() => remove(index)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="col-span-12">
        {specificationList?.length <= 14 && (
          <Button
            unfocusable
            icon={<RiAddLine />}
            iconClassName="text-primary"
            text="Thêm thông số"
            className="pl-0 mb-4 -mt-1 text-sm text-primary"
            onClick={() => append({ value: "" })}
          />
        )}
      </div>
    </>
  );
}
