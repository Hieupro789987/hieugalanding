import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { RiVideoUploadLine } from "react-icons/ri";
import { ServiceTagService } from "../../../../lib/repo/services/service-tag.repo";
import { ShopServiceCategoryService } from "../../../../lib/repo/services/shop-service-category.repo";
import { ImageUploadField } from "../../../shared/common/image-upload-field";
import { FileUploadField } from "../../../shared/question/components/question-form/question-form";
import { Editor, Field, Input, Radio, Select, Textarea } from "../../../shared/utilities/form";
import { useDataTable } from "../../../shared/utilities/table/data-table";
import { PartLabel } from "./shop-services-form";

interface ShopServiceInfoProps extends ReactProps {}

export function ShopServiceInfo({ ...props }: ShopServiceInfoProps) {
  const { formItem } = useDataTable();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const servicePriceType = watch("servicePriceType");

  const equalZeroPriceError = useMemo(() => errors?.price?.message, [errors]);

  useEffect(() => {
    if (servicePriceType === "CONTACT") {
      setValue("price", 0);
    }
  }, [servicePriceType]);

  return (
    <>
      <PartLabel text="thông tin dịch vụ" className="mt-0" />
      <Field cols={6} label="Tiêu đề dịch vụ" name="name" labelClassName="text-accent" required>
        <Input autoFocus placeholder="Nhập tiêu đề..." />
      </Field>
      <Field
        cols={6}
        label={"Slug"}
        name="slug"
        tooltip={
          "Chỉ cho phép chữ, số và dấu gạch ngang, không có khoảng trắng, sẽ tự tạo nếu để trống. Ví dụ: dich-vu-123"
        }
        labelClassName="text-accent"
        validation={{ code: true }}
      >
        <Input placeholder={`(Tự tạo nếu để trống)`} />
      </Field>
      <Field
        cols={6}
        label="Loại dịch vụ"
        name="serviceTagIds"
        labelClassName="text-accent"
        required
      >
        <Select
          multi
          clearable
          placeholder="Chọn loại dịch vụ"
          optionsPromise={() =>
            ServiceTagService.getAllOptionsPromise({
              query: { filter: { deletedAt: { $eq: null } } },
            })
          }
        />
      </Field>
      <Field
        cols={6}
        label="Danh mục dịch vụ"
        name="shopServiceCategoryId"
        labelClassName="text-accent"
        required
      >
        <Select
          clearable
          placeholder="Chọn danh mục dịch vụ"
          optionsPromise={() => ShopServiceCategoryService.getAllOptionsPromise()}
          onChange={(val) => {
            setValue("shopServiceCategoryId", val);
            setValue("specialistIds", []);
          }}
        />
      </Field>
      <Field
        noError
        cols={12}
        label="Giá dịch vụ"
        name="servicePriceType"
        labelClassName="text-accent"
        required
        {...(!!equalZeroPriceError && { error: equalZeroPriceError })}
      >
        <Radio
          options={[
            { value: "FIXED", label: "Giá cố định" },
            // { value: "CONTACT", label: "Giá liên hệ" },
          ]}
          iconClassName={"!text-xl !pt-0.5"}
          className="flex"
          cols={6}
        />
      </Field>
      <div className="col-span-2"></div>
      <Field
        cols={3}
        label=""
        name="price"
        required={servicePriceType === "FIXED"}
        readOnly={servicePriceType !== "FIXED"}
        className="-mt-11"
        errorClassName="w-60"
      >
        <Input number suffix={"VND"} className="w-60" />
      </Field>
      <div className="col-span-7"></div>
      <Field cols={12} label="Mô tả" labelClassName="text-accent" name="description" required>
        <Editor
          minHeight="100px"
          controlClassName=""
          className="bg-transparent border rounded border-slate-400"
          maxWidth="none"
          placeholder={"Mô tả dịch vụ..."}
        />
      </Field>
      <ImageUploadField
        maxImage={4}
        label="Hình ảnh đính kèm"
        accept="image/*"
        name="images"
        className="mb-0"
        required
        defaultValue={formItem?.images}
      />
      {/* <FileUploadField
        label="Video đính kèm"
        accept="video/*"
        icon={<RiVideoUploadLine />}
        subText="Tải lên tệp video"
        name="video"
        iconClassName="text-4xl"
        cols={6}
      /> */}
    </>
  );
}
