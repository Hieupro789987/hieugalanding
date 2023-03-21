import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";
import { uploadImage } from "../../../../lib/helpers/image";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { EndUserService } from "../../../../lib/repo/end-user.repo";
import { GlobalCustomerService } from "../../../../lib/repo/global-customer/global-customer.repo";
import { ChangeAvatarDialog } from "../../../shared/auth/change-avatar-dialog";
import { ChangePasswordDialog } from "../../../shared/auth/change-password-dialog";
import { LabelAccent, labelAccentField } from "../../../shared/common/label-accent";
import { TextRequired } from "../../../shared/common/text-required";
import { CloseButtonHeaderDialog } from "../../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { Button, DatePicker, Field, Form, Input, Radio } from "../../../shared/utilities/form";
import { BreadCrumbs, Img } from "../../../shared/utilities/misc";

export function ProfileAccount({ ...props }) {
  const toast = useToast();
  const [type, setType] = useState();
  const screenMd = useScreen("md");
  const { globalCustomer, setGlobalCustomer } = useAuth();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

  return (
    <>
      {!screenMd && (
        <div className="px-3 bg-white border-b boder-b-neutralGrey">
          <BreadCrumbs
            className="relative z-10 my-3"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                href: "/profile",
                label: "Tài khoản",
              },
              {
                label: "Hồ sơ cá nhân",
              },
            ]}
          />
        </div>
      )}
      <div className="p-3 text-base bg-white text-accent lg:p-0">
        {screenMd && (
          <div className="my-5 text-lg font-semibold leading-7 lg:my-0 text-accent">
            Hồ sơ của tôi
          </div>
        )}
        <div className="flex flex-row items-center justify-between overflow-hidden lg:mt-5">
          <div className="flex flex-row items-center">
            <div className="relative hover:opacity-70">
              <Img
                src={globalCustomer?.avatar}
                avatar
                className="object-cover w-16 border border-gray-100 rounded-full shadow-sm lg:w-20"
              />
            </div>
            <div className="ml-4 overflow-hidden">
              <div className="text-base font-bold leading-6 capitalize lg:text-lg text-ellipsis-1 text-accent ">
                {globalCustomer?.phone}
              </div>

              <Button
                text="Đổi avatar"
                textPrimary
                onClick={() => setOpenChangeAvatar(true)}
                className="h-auto px-0 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>
        <div className="my-4 lg:my-8">
          <Form
            grid
            defaultValues={globalCustomer}
            onSubmit={async (data) => {
              try {
                const res = await GlobalCustomerService.globalCustomerUpdateMe(
                  data.type === "INDIVIDUAL"
                    ? {
                        ...data,
                        ...{
                          companyName: null,
                          companyTaxNumber: null,
                          companyHotline: null,
                          companyAddress: null,
                        },
                      }
                    : data
                );
                setGlobalCustomer(res);
                toast.success(`Cập nhật thông tin thành công`);
              } catch (error) {
                toast.error(`Cập nhật thông tin thất bại. ${error.message}`);
              }
            }}
          >
            <Field
              name="name"
              label="Họ và tên"
              labelClassName="text-sm"
              cols={screenMd ? 6 : 12}
              required
              {...labelAccentField}
            >
              <Input
                inputClassName="lg:text-base text-sm"
                placeholder="Nhập họ và tên..."
                autoFocus
              />
            </Field>

            <div className={`${screenMd ? "col-span-6" : "col-span-12"}  mb-5`}>
              <LabelAccent text="Số điện thoại" />
              <div className="flex items-center w-full mt-1">
                <span className="text-sm font-medium lg:text-base text-accent">
                  {globalCustomer?.phone}
                </span>
                {/* <Button
                  text="Thay đổi"
                  textPrimary
                  small={!screenMd}
                  className="p-0 ml-5 underline"
                  unfocusable
                /> */}
              </div>
            </div>
            <Field
              name="email"
              label="Email"
              labelClassName="text-sm"
              cols={screenMd ? 6 : 12}
              {...labelAccentField}
            >
              <Input
                value={globalCustomer?.email}
                inputClassName="text-sm lg:text-base"
                placeholder="Nhập địa chỉ Email"
              />
            </Field>
            <div className={`${screenMd ? "col-span-6" : "col-span-12"} mb-5`}>
              <LabelAccent text="Mật khẩu" />
              <div className="flex items-center w-full mt-1">
                <span className="text-sm font-medium lg:text-base text-accent">******</span>
                <Button
                  text="Thay đổi"
                  textPrimary
                  small={!screenMd}
                  className="p-0 ml-5 underline"
                  unfocusable
                  onClick={() => setOpenChangePasswordDialog(true)}
                />
              </div>
            </div>

            <Field label="Ngày sinh" name="birthday" cols={screenMd ? 6 : 12} {...labelAccentField}>
              <DatePicker placeholder="Ngày sinh" defaultValue={globalCustomer?.birthday} />
            </Field>

            <Field label="Giới tính" name="gender" cols={6} {...labelAccentField}>
              <Radio
                defaultValue={globalCustomer?.type}
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
              />
            </Field>

            <Field label="Loại người dùng" name="type" {...labelAccentField}>
              <Radio
                onChange={(val) => setType(val)}
                defaultValue={globalCustomer?.type}
                options={[
                  { value: "INDIVIDUAL", label: "Cá nhân" },
                  { value: "COMPANY", label: "Tổ chức doanh nghiệp" },
                ]}
              />
            </Field>
            {(type === "COMPANY" ||
              (globalCustomer?.type === "COMPANY" && type !== "INDIVIDUAL")) && (
              <OrganizationGroupsField />
            )}
            <div className="items-center col-span-12 lg:flex lg:flex-row gap-x-12">
              <TextRequired />
              <Form.Footer
                className="mt-1 lg:flex-row lg:mt-0"
                submitText="Lưu thay đổi"
                submitProps={{
                  className:
                    "w-full flex flex-1 lg:w-[210px] h-[57px]  lg:flex-none shadow-lg shadow-green-700/50",
                }}
                cancelText=""
              />
            </div>
          </Form>

          <ChangeGlobalCustomerPassword
            isOpen={openChangePasswordDialog}
            onClose={() => setOpenChangePasswordDialog(false)}
          />

          <ChangeAvatarDialog
            userType={globalCustomer}
            isOpen={!!openChangeAvatar}
            onClose={() => setOpenChangeAvatar(false)}
          />
        </div>
      </div>
    </>
  );
}

export function OrganizationGroupsField({ ...props }) {
  const screenMd = useScreen("md");
  const { unregister } = useFormContext();
  const { globalCustomer } = useAuth();

  useEffect(() => {
    return () => {
      unregister(["companyName", "companyTaxNumber", "companyHotline", "companyAddress"]);
    };
  }, []);
  return (
    <>
      <Field name="companyHotLineRegionCode" className="hidden">
        <Input defaultValue="VN" />
      </Field>
      <Field
        label="Tên công ty"
        cols={screenMd ? 6 : 12}
        name="companyName"
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyName}
          inputClassName="text-sm lg:text-base"
          placeholder="Nhập tên công ty"
        />
      </Field>
      <Field
        label="Mã số thuế"
        cols={screenMd ? 6 : 12}
        name="companyTaxNumber"
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyTaxNumber}
          inputClassName="text-sm lg:text-base"
          placeholder="Nhập mã số thuế"
        />
      </Field>
      <Field
        label="Hotline"
        cols={screenMd ? 6 : 12}
        name="companyHotline"
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyHotline}
          inputClassName="text-sm lg:text-base"
          placeholder="Nhập hotline"
        />
      </Field>
      <Field
        label="Địa chỉ"
        cols={screenMd ? 6 : 12}
        name="companyAddress"
        required
        {...labelAccentField}
      >
        <Input
          defaultValue={globalCustomer?.companyAddress}
          inputClassName="text-sm lg:text-base  text-gray-600"
          placeholder="Nhập địa chỉ..."
        />
      </Field>
    </>
  );
}

export function ChangeGlobalCustomerPassword({ ...props }) {
  const toast = useToast();
  const alert = useAlert();
  const router = useRouter();
  const { logoutGlobalCustomer } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
      const res = await GlobalCustomerService.updatePasswordGlobalCustomer(
        newPassword,
        oldPassword
      );
      await alert.success("Đổi mật khẩu thành công!", "Vui lòng đăng nhập lại với mật khẩu mới");
      await logoutGlobalCustomer();
      router.push("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <Form {...props} width="350px" dialog onSubmit={handleSubmit} className="text-accent">
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Thay đổi mật khẩu" subtitle="Vui lòng nhập đủ thông tin để tiếp tục" />
      <Field label="Mật khẩu cũ" name="oldPassword" required {...labelAccentField}>
        <Input type="password" placeholder="Vui lòng nhập mật khẩu cũ..." autoFocus />
      </Field>
      <Field
        label="Mật khẩu mới"
        name="newPassword"
        validation={{
          password: true,
        }}
        required
        {...labelAccentField}
      >
        <Input type="password" placeholder="Vui lòng nhập mật khẩu mới..." />
      </Field>
      <Form.Footer submitText="Đổi mật khẩu" submitProps={{ large: true }} />
    </Form>
  );
}
