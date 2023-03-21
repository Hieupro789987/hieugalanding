import Link from "next/link";
import QRCode from "qrcode.react";
import { useRef, useState } from "react";
import { RiDownload2Line, RiExternalLinkLine } from "react-icons/ri";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { MemberService, SHOP_TYPE_LIST } from "../../../../lib/repo/member.repo";
import { ShopCategoryService } from "../../../../lib/repo/shop-category.repo";
import {
  Button,
  Field,
  Form,
  ImageInput,
  Input,
  Label,
  Select,
} from "../../../shared/utilities/form";
import { Img } from "../../../shared/utilities/misc";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";

export function GeneralSettings() {
  const { member, memberUpdateMe } = useAuth();
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingMemberAvatar, setUploadingMemberAvatar] = useState(false);
  const [openChangepassword, setOpenChangePassword] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      await memberUpdateMe(data);
      toast.success("Lưu thay đổi thành công");
    } catch (err) {
      toast.error("Lưu thay đổi thất bại. " + err.message);
    }
  };

  const onAvatarChange = async (image: string) => {
    try {
      setUploadingMemberAvatar(true);
      await memberUpdateMe({ shopLogo: image });
      toast.success("Cập nhật ảnh đại diện cửa hàng thành công");
    } catch (err) {
      toast.error("Cập nhật ảnh đại diện cửa hàng thất bại. " + err.message);
    } finally {
      setUploadingMemberAvatar(false);
    }
  };

  function download() {
    let canvas: any = document.getElementById(member.name + "QR");
    if (canvas) {
      let a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = member.shopName + "-QR.png";
      a.click();
    }
  }
  return (
    <>
      <Form defaultValues={member} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
        <div className="flex items-center my-6">
          <Img
            className="bg-white border border-gray-300 rounded-full w-14"
            src={member.shopLogo}
          />
          <div className="pl-3">
            <div className="text-lg font-bold text-gray-700">{member.shopName}</div>
            <Button
              className="h-auto px-0 text-sm hover:underline"
              textPrimary
              text="Đổi hình đại diện"
              isLoading={uploadingAvatar || uploadingMemberAvatar}
              onClick={() => {
                avatarUploaderRef.current().onClick();
              }}
            />
            <AvatarUploader
              onRef={(ref) => {
                avatarUploaderRef.current = ref;
              }}
              onUploadingChange={setUploadingAvatar}
              onImageUploaded={onAvatarChange}
            />
          </div>
        </div>
        <Label text="Link cửa hàng" />
        <Link href={`${location.origin}/store/${member.code}`}>
          <a
            target="_blank"
            className="flex items-center pt-0.5 pb-3 pl-1 font-semibold text-primary hover:text-primary-dark underline hover:underline"
          >
            {`${location.origin}/store/${member.code}`}
            <i className="ml-2 text-base">
              <RiExternalLinkLine />
            </i>
          </a>
        </Link>
        <Label text="Mã QR Code cửa hàng" />
        <div className="pt-1 pb-3 pl-1">
          <QRCode
            value={`${location.origin}/store/${member.code}`}
            size={230}
            className=""
            id={member.name + "QR"}
          />
          <Button
            icon={<RiDownload2Line />}
            text="Tải xuống"
            className="mx-2 w-56 ml-1.5 focus:outline-white"
            onClick={() => download()}
          />
        </div>
        <Form.Title title="Thông tin cơ bản" />
        <Field label="Tên cửa hàng" name="shopName">
          <Input className="h-12" />
        </Field>
        <Field label="Danh mục cửa hàng" name="categoryId">
          <Select
            className="inline-grid h-12"
            optionsPromise={() => ShopCategoryService.getAllOptionsPromise()}
          />
        </Field>
        <Field label="Loại cửa hàng" name="" readOnly>
          <Select className="inline-grid h-12" options={SHOP_TYPE_LIST} value={member?.shopType} />
        </Field>
        {member?.shopType === "SALE_POINT" && (
          <>
            <Field label="Tài khoản đại lý" name="member.customer" readOnly>
              <Input defaultValue={member?.customer?.name || ""} />
            </Field>
            <Field label="Điểm bán của cửa hàng" name="parentMember.name" readOnly>
              <Input defaultValue={member?.parentMember?.name || ""} />
            </Field>
          </>
        )}
        <Field label="Ảnh nền cửa hàng" name="shopCover">
          <ImageInput cover largeImage ratio169 inputClassName="h-12" buttonClassName="h-12" />
        </Field>
        <Form.Title title="Thông tin tài khoản" />
        <Field label="Email đăng nhập" name="username" readOnly>
          <Input className="h-12" />
        </Field>
        <Field label="Mã cửa hàng" name="code" readOnly>
          <Input className="h-12" />
        </Field>
        <Field label="Tên chủ cửa hàng" name="name">
          <Input className="h-12" />
        </Field>
        <Field label="Số điện thoại" name="phone">
          <Input className="h-12" />
        </Field>
        <Field label="Mật khẩu">
          <div className="flex items-center">
            <Button
              outline
              className="bg-white"
              text="Đổi mật khẩu"
              onClick={() => setOpenChangePassword(true)}
            />
          </div>
        </Field>
        <Form.Footer
          className="mt-1"
          isReverse={false}
          submitProps={{ large: true, className: "shadow" }}
        />
      </Form>
      <Form
        title="Thay đổi mật khẩu"
        dialog
        defaultValues={{
          password: "",
          retypePassword: "",
        }}
        isOpen={openChangepassword}
        onClose={() => setOpenChangePassword(null)}
        onSubmit={async (data) => {
          try {
            await MemberService.updateMemberPassword(member?.id, data.password);
            setOpenChangePassword(null);
            toast.success("Thay đổi mật khẩu thành công.");
          } catch (err) {
            toast.error("Thay đổi mật khẩu thất bại. " + err.message);
          }
        }}
        validate={{
          retypePassword: (values) =>
            values.password != values.retypePassword ? "Mật khẩu nhập lại không trùng khớp" : "",
        }}
      >
        <Field required name="password" label="Mật khẩu mới">
          <Input type="password" />
        </Field>
        <Field required name="retypePassword" label="Nhập lại mật khẩu mới">
          <Input type="password" />
        </Field>
        <Form.Footer />
      </Form>
    </>
  );
}
