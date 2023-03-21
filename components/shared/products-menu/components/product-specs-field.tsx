import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddFill, RiCloseLine } from "react-icons/ri";
import { ProductSpecs } from "../../../../lib/repo/product-specs.repo";
import { Dialog } from "../../utilities/dialog";
import { Button, Field, Form, Input, Textarea } from "../../utilities/form";
import { ProductSpecsTemplate } from "./product-specs-template";

export function ProductSpecsField() {
  const [openProductParameter, setOpenProductParameter] = useState(false);
  const name = "productSpecs";
  const { fields, append, move, remove, replace, insert } = useFieldArray({ name });
  const {
    clearErrors,
    unregister,
    formState: { errors },
  } = useFormContext();
  const productSpecs = fields as ({ id: string } & ProductSpecs)[];

  return (
    <div className="col-span-12">
      <Form.Title title="Thông số sản phẩm" />
      <div className="col-span-12 mt-4 flex flex-col gap-y-3 items-start">
        {productSpecs?.map((spec, index) => (
          <ProductSpecsItem
            key={spec.id}
            onRemove={() => remove(index)}
            name={`${name}[${index}]`}
            index={index}
          />
        ))}
        {productSpecs.length > 0 && (
          <Button
            unfocusable
            primary
            className="p-2 mt-2"
            textPrimary
            icon={<RiAddFill />}
            iconClassName="text-white rounded-sm text-2xl"
            onClick={() =>
              append({
                name: "",
                value: "",
              })
            }
          />
        )}
        <Button
          unfocusable
          className="px-0 my-2"
          textPrimary
          {...(productSpecs.length <= 0 && { icon: <RiAddFill /> })}
          text={`${
            productSpecs.length > 0 ? "Đổi mẫu thông số sản phẩm" : "Thêm thông số sản phẩm"
          }`}
          onClick={() => setOpenProductParameter(true)}
        />

        <Dialog
          width={520}
          isOpen={openProductParameter}
          onClose={() => setOpenProductParameter(false)}
        >
          <ProductSpecsTemplate
            onSpecProductSelect={(spec) => {
              if (productSpecs.length > 0) {
                unregister(name);
                clearErrors();
                replace(spec.specs);
              } else {
                append(spec.specs);
              }

              setOpenProductParameter(false);
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}

export function ProductSpecsItem({
  onRemove,
  name,
  index,
}: {
  onRemove?: () => void;
  name?: string;
  index?: number;
}) {
  const {
    watch,
    clearErrors,

    setValue,

    formState: { errors, isSubmitting },
  } = useFormContext();

  const nameWatch: string = watch(`${name}.name`, null);
  const valueWatch: string = watch(`${name}.value`, null);
  const productSpecsWatch = watch("productSpecs");
  const fieldsLength = productSpecsWatch.length;
  const [nameTmp, setNameTmp] = useState<any>(undefined);
  const [valueTmp, setValueTmp] = useState<any>(undefined);

  useEffect(() => {
    if (isSubmitting) {
      setNameTmp(nameWatch);
      setValueTmp(valueWatch);
    }
  }, [isSubmitting]);

  useEffect(() => {
    const textarea = document.querySelectorAll(".error");
    if (!!textarea && textarea?.length > 1) {
      textarea.forEach((item, index) => {
        if (!!item?.textContent) {
          textarea[index]?.classList?.remove("error");
        }
      });
    } else {
      textarea[0]?.classList?.remove("error");
    }
  }, [nameTmp, valueTmp]);

  return (
    <div className="flex flex-row relative items-start gap-x-1 cursor-pointer group w-full">
      <Field name={`${name}.name`} required noError={nameTmp != ""}>
        <Textarea
          placeholder="Tên thông số"
          rows={1}
          className="resize-none w-2/5 "
          onChange={(val) => {
            console.log("val: ", val);
            if (!val.trim()) {
              setNameTmp(null);
            } else {
              setNameTmp(val);
            }
            setValue(`${name}.name`, val.trim());
          }}
        />
      </Field>
      <Field name={`${name}.value`} required className="w-full" noError={valueTmp != ""}>
        <Textarea
          placeholder="Nhập mô tả"
          rows={1}
          className="resize-none w-full "
          onChange={(val) => {
            if (!val.trim()) {
              setValueTmp(null);
            } else {
              setValueTmp(val);
            }
            setValue(`${name}.value`, val.trim());
          }}
        />
      </Field>

      <div className="absolute top-0 transform translate-y-[36%] border shadow hidden group hover:border-danger -right-3 w-6 h-6 rounded-full flex-row items-center justify-center bg-white  group-hover:flex">
        <Button
          hoverDanger
          className="px-0  cursor-pointer "
          onClick={() => {
            onRemove();
          }}
          icon={<RiCloseLine />}
          tooltip="Xóa"
          unfocusable
        />
      </div>
    </div>
  );
}
