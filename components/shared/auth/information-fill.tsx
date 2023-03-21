import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiArrowLeftSLine, RiCloseLine } from "react-icons/ri";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { EndUserService } from "../../../lib/repo/end-user.repo";
import { GlobalCustomerService } from "../../../lib/repo/global-customer/global-customer.repo";
import { LabelAccent, labelAccentField } from "../common/label-accent";
import { Dialog, DialogProps } from "../utilities/dialog";
import { Button, DatePicker, Field, Form, FormProps, Input, Label, Radio } from "../utilities/form";
import { Img } from "../utilities/misc";
import { AVATARS_DEFAULT, ChangeAvatarDialog } from "./change-avatar-dialog";

export function InformationFill({ ...props }: FormProps) {
  const screenLg = useScreen("lg");
  const router = useRouter();
  const toast = useToast();
  const [type, setType] = useState();
  const [url, setUrl] = useState();
  const { globalCustomer, setGlobalCustomer, redirectToGlobalCustomer } = useAuth();
  const [isOpenDialogAvatar, setIsOpenDialogAvatar] = useState(false);

  const handleSubmit = async (data) => {
    console.log(data);

    const res = await GlobalCustomerService.globalCustomerUpdateMe(
      data.type === "INDIVIDUAL"
        ? {
            ...data,
            avatar: data?.avatar ? data?.avatar : AVATARS_DEFAULT[0],
            ...{
              companyName: null,
              companyTaxNumber: null,
              companyHotline: null,
              companyAddress: null,
            },
          }
        : { ...data, avatar: data?.avatar ? data?.avatar : AVATARS_DEFAULT[0] }
    );
    setGlobalCustomer(res);
    redirectToGlobalCustomer();
    toast.success("Thay đổi thông tin thành công");
  };

  return (
    <Form
      grid
      onSubmit={handleSubmit}
      width={782}
      {...props}
      defaultValues={globalCustomer}
      onChange={(data) => setUrl(data.avatar)}
    >
      <h2 className="col-span-12 mt-5 mb-2 text-4xl font-bold text-center text-accent">
        Điền thông tin tài khoản
      </h2>
      <p className="col-span-12 mb-5 font-bold text-center text-gray-500">
        Vui lòng nhập đủ thông tin để tiếp tục
      </p>

      <div className="col-span-12 mt-5 mb-2 font-extrabold text-primary">THÔNG TIN BẮT BUỘC</div>

      <Field label="Họ và tên" name="name" cols={screenLg ? 6 : 12} required {...labelAccentField}>
        <Input className="h-14" placeholder="Nhập họ tên của bạn" autoFocus />
      </Field>
      <Field
        label="Số điện thoại"
        name="phone"
        cols={screenLg ? 6 : 12}
        readOnly
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.phone}
          className="border-transparent h-14 focus-within:border-none hover:border-none"
          type="number"
        />
      </Field>
      <div className="col-span-12 mb-2">
        {/* THÔNG TIN KHÁC <span className="font-light text-accent">- không bắt buộc</span> */}
        <Label
          text="THÔNG TIN KHÁC"
          subText="- Không bắt buộc"
          className="text-base font-extrabold text-primary"
          subTextClassName="text-accent"
        />
      </div>

      <Field
        label="Email"
        name="email"
        cols={screenLg ? 6 : 12}
        className="border-transparent"
        {...labelAccentField}
      >
        <Input className="h-14" type="email" placeholder="Nhập email của bạn" />
      </Field>
      <Field label="Giới tính" name="gender" cols={screenLg ? 6 : 12} {...labelAccentField}>
        <Radio
          defaultValue={globalCustomer?.gender}
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
        />
      </Field>
      <Field label="Ngày sinh" name="birthday" cols={screenLg ? 6 : 12} {...labelAccentField}>
        <DatePicker className="h-14" placeholder="Ngày sinh" />
      </Field>

      <Field label="Loại người dùng" name="type" cols={screenLg ? 6 : 12} {...labelAccentField}>
        <Radio
          onChange={(val) => setType(val)}
          defaultValue={globalCustomer?.type}
          options={[
            { value: "INDIVIDUAL", label: "Cá nhân" },
            { value: "COMPANY", label: "Tổ chức doanh nghiệp" },
          ]}
        />
      </Field>
      {(type === "COMPANY" || (globalCustomer?.type === "COMPANY" && type !== "INDIVIDUAL")) && (
        <OrganizationGroupsField />
      )}
      <div className="col-span-12">
        <LabelAccent text="Avatar" />
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsOpenDialogAvatar(true)}
        >
          <Img
            avatar
            default={AVATARS_DEFAULT[0]}
            src={url}
            className={`${screenLg ? "w-[8%]" : "w-[20%]"}`}
            lazyload={false}
          />

          <span className="ml-6 underline text-primary">Đổi avatar</span>
        </div>
      </div>

      <ChangeAvatarDialog
        userType={globalCustomer}
        isOpen={isOpenDialogAvatar}
        onClose={() => setIsOpenDialogAvatar(false)}
      />

      <Form.Footer
        cancelText=""
        submitText="Xác nhận"
        submitProps={{
          className: `${
            screenLg ? "w-80 mx-auto " : "w-full"
          }  mt-5 shadow-lg h-14 shadow-green-700/50`,
        }}
      />
    </Form>
  );
}

export function OrganizationGroupsField({ ...props }) {
  const screenLg = useScreen("lg");
  const { unregister } = useFormContext();
  const { globalCustomer } = useAuth();

  useEffect(() => {
    return () => {
      unregister(["companyName", "companyTaxNumber", "companyHotline", "companyAddress"]);
    };
  }, []);

  return (
    <>
      <Field
        label="Tên công ty"
        name="companyName"
        className="border-transparent"
        cols={screenLg ? 6 : 12}
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyName}
          className="h-14"
          placeholder="Tên công ty"
        />
      </Field>
      <Field
        label="Mã số thuế"
        name="companyTaxNumber"
        className="border-transparent"
        cols={screenLg ? 6 : 12}
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyTaxNumber}
          className="h-14"
          placeholder="Mã số thuế"
        />
      </Field>
      <Field
        label="Hotline"
        name="companyHotline"
        className="border-transparent"
        cols={screenLg ? 6 : 12}
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyHotline}
          className="h-14"
          placeholder="Hotline"
        />
      </Field>
      <Field
        label="Địa chỉ"
        name="companyAddress"
        className="border-transparent"
        cols={screenLg ? 6 : 12}
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyAddress}
          className="h-14"
          placeholder="Địa chỉ"
        />
      </Field>
    </>
  );
}
