import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiEdit2Line, RiDeleteBin7Line } from "react-icons/ri";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  AddressBook,
  AddressBookService,
} from "../../../../lib/repo/global-customer/address-book.repo";
import { TextRequired } from "../../../shared/common/text-required";
import { Button, Field, Form, FormProps, Input } from "../../../shared/utilities/form";
import { AddressGroup } from "../../../shared/utilities/form/address-group";
import { BreadCrumbs, Spinner, StatusLabel } from "../../../shared/utilities/misc";
import { ProfileAddressWebapp } from "../profile-address-webapp";

export function ProfileAddress() {
  const screenLg = useScreen("lg");
  const screenMd = useScreen("md");
  const { query, push, pathname } = useRouter();
  const toast = useToast();
  const [openAddressFormDialog, setOpenAddressFormDialog] = useState<any>();
  const { items, loadAll, loadMore, hasMore, loading } = useCrud(AddressBookService, { limit: 4 });

  const handleClickChooseAddress = async (data) => {
    if (!data) return;
    const { fullName, phone, regionCode, address } = data;

    try {
      await AddressBookService.update({
        id: data?.id,
        data: { fullName, phone, regionCode, address, isDefault: true },
      });
      await loadAll();
      toast.success("Thiết lập địa chỉ mặc định thành công");
    } catch (error) {
      console.error(error);
      toast.error("Thiết lập địa chỉ mặc định thất bại", error.message);
    }
  };

  const handleClickRemoveAddress = async (idAdress: string) => {
    if (!idAdress) return;
    try {
      await AddressBookService.delete({ id: idAdress });
      await loadAll();
      toast.success("Xóa địa chỉ thành công");
    } catch (error) {
      console.error(error);
      toast.error("Xóa địa chỉ thất bại", error.message);
    }
  };

  useEffect(() => {
    if (screenLg) {
      push("/profile/address");
    }
  }, [pathname, screenLg]);

  if (query.create) {
    return <ProfileAddressWebapp loadAll={loadAll} />;
  }
  if (!!query.id) {
    return <ProfileAddressWebapp id={query.id} loadAll={loadAll} />;
  }

  if (items === null || items === undefined) return <Spinner />;

  return (
    <>
      {!screenLg && (
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
                label: "Danh sách địa chỉ",
              },
            ]}
          />
        </div>
      )}
      <div className="flex-1 bg-white">
        <div className={` ${!screenLg && "pb-5 main-container"}`}>
          <div className="flex items-center justify-between mb-5">
            <div className="hidden font-extrabold text-accent lg:block">ĐỊA CHỈ</div>
            {items.length > 0 && (
              <Button
                primary
                text="Tạo địa chỉ"
                large
                className="w-full mt-4 shadow-lg lg:mt-0 lg:w-auto lg:shadow-none shadow-green-700/50"
                {...(screenLg
                  ? { onClick: () => setOpenAddressFormDialog(null) }
                  : { href: "/profile/address?create=true" })}
              />
            )}
          </div>

          {items.length > 0 ? (
            items.map((item) => (
              <AddressItem
                key={item.id}
                profileAddress={item}
                onclick={(val) => setOpenAddressFormDialog(val)}
                onClickChooseAddress={handleClickChooseAddress}
                onClickRemoveAddress={handleClickRemoveAddress}
              />
            ))
          ) : (
            <EmptyAddressList
              {...(screenLg
                ? { onclick: () => setOpenAddressFormDialog(null) }
                : { href: "/profile/address?create=true" })}
            />
          )}
          {}

          {items.length > 0 && hasMore && (
            <div className="mt-3 text-center">
              <Button
                text="Xem thêm"
                textPrimary
                isLoading={loading}
                asyncLoading={false}
                onClick={() => loadMore()}
              />
            </div>
          )}

          <AddressFormDialog
            title={openAddressFormDialog === null ? "Tạo địa chỉ mới" : "Chi tiết địa chỉ"}
            isOpen={openAddressFormDialog !== undefined}
            loadAll={loadAll}
            dialog
            width={350}
            onClose={() => {
              setOpenAddressFormDialog(undefined);
            }}
            address={openAddressFormDialog}
          />
        </div>
      </div>
    </>
  );
}

export function EmptyAddressList({
  ...props
}: {
  onclick?: (val?: any, options?: any) => void;
  href?: string;
}) {
  const screenLg = useScreen("lg");
  return (
    <div className="w-full text-center">
      <img src="/assets/img/map.png" alt="map" className="m-auto" />
      <div className="mt-4 text-sm mb-14 lg:text-base">
        Bạn chưa có địa chỉ, vui lòng tạo địa chỉ mới
      </div>
      <Button
        primary
        text="Tạo địa chỉ mới"
        className="w-80"
        large
        {...(screenLg
          ? {
              onClick: () => props.onclick(),
            }
          : { href: props.href })}
      />
    </div>
  );
}

export interface AddressProps {
  id: string;
  name: string;
  isChoose: boolean;
  phone: string;
  address: string;
}

export function AddressItem({
  profileAddress,
  ...props
}: {
  profileAddress: AddressBook;
  onclick?: (val?: any, option?: any) => void;
  onClickChooseAddress?: (val?: any) => void;
  onClickRemoveAddress?: (val?: any) => void;
}) {
  const screenLg = useScreen("lg");
  const alert = useAlert();

  return (
    <div className="p-2 mb-2 border rounded-md lg:p-4 border-neutralLight hover:border-primary">
      <div className="flex flex-wrap items-center gap-2 mb-2 text-sm font-extrabold lg:block lg:text-base">
        {profileAddress?.fullName}
        {profileAddress?.isDefault && (
          <span className="px-2 py-1 text-sm font-light rounded-sm lg:ml-3 bg-primary-light lg:text-base text-success">
            Mặc định
          </span>
        )}
      </div>
      <div className="text-sm lg:text-base">
        <b>Số điện thoại:</b> {profileAddress?.internationalPhone}
      </div>
      <div className="text-sm lg:text-base">
        <b>Địa chỉ: </b>
        {profileAddress?.address?.street && `${profileAddress?.address?.street}, `}
        {profileAddress?.address?.ward && `${profileAddress?.address?.ward}, `}
        {profileAddress?.address?.district && `${profileAddress?.address?.district}, `}
        {profileAddress?.address?.province && profileAddress?.address?.province}
      </div>
      <div className="flex items-center mt-3">
        <Button
          outline
          text="Thiết lập mặc định"
          {...(!profileAddress.isDefault && { textPrimary: true })}
          className={`text-xs lg:px-6 px-2  font-medium ${
            profileAddress.isDefault
              ? "!pointer-events-none !border-gray-300 !text-neutralGrey"
              : "text-primary border-primary"
          } lg:text-base`}
          onClick={() => props.onClickChooseAddress(profileAddress)}
        />
        <Button
          text="Sửa"
          textPrimary
          icon={<RiEdit2Line />}
          iconClassName="text-xl"
          className="px-2 text-sm lg:text-base lg:px-6"
          {...(screenLg
            ? { onClick: () => props.onclick(profileAddress) }
            : { href: `/profile/address?id=${profileAddress.id}` })}
        />
        <Button
          text="Xóa"
          icon={<RiDeleteBin7Line />}
          className="px-0 text-sm lg:text-base text-neutralGrey"
          iconClassName="text-xl"
          onClick={async () => {
            if (!profileAddress.id) return;
            const res = await alert.danger(
              "Xoá địa chỉ",
              `Bạn có chắc chắc muốn xoá địa chỉ của "${profileAddress.fullName}" không?`,
              "Xoá địa chỉ"
            );

            if (!res) return;
            props.onClickRemoveAddress(profileAddress.id);
          }}
        />
      </div>
    </div>
  );
}

export function AddressFormDialog({
  address,
  ...props
}: FormProps & { address: any; loadAll?: (refresh: boolean) => Promise<any> }) {
  const toast = useToast();
  const screenLg = useScreen("lg");
  const router = useRouter();
  const handleSubmit = async (data) => {
    try {
      await AddressBookService.createOrUpdate({
        id: address?.id,
        data: address?.id ? data : { ...data, isDefault: false },
      });
      screenLg ? props.onClose() : router.push("/profile/address");
      await props.loadAll(true);
      toast.success(address ? "lưu địa chỉ thành công" : "Tạo địa chỉ thành công");
    } catch (error) {
      console.error(error);
      toast.error(address ? "Lưu địa chỉ thất bại" : "Tạo địa chỉ thất bại", error.message);
    }
  };

  return (
    <Form
      defaultValues={address ? { ...address, phone: address?.internationalPhone } : {}}
      {...props}
      headerClass="mx-5 pt-2 flex rounded-t bg-white border-b border-b-neutralLight"
      onSubmit={handleSubmit}
    >
      <Field label="Họ tên" name="fullName" required>
        <Input placeholder="Nhập họ tên" />
      </Field>
      <Field name="regionCode" className="hidden">
        <Input defaultValue="VN" />
      </Field>
      <Field label="Số điện thoại" name="phone" validation={{ phone: true }} required>
        <Input placeholder="Nhập số điện thoại" />
      </Field>
      <AddressGroup
        provinceCols={12}
        districtCols={12}
        wardCols={12}
        addressCols={12}
        provinceLabel="Tỉnh/thành"
        districtLabel="Quận/huyện"
        wardLabel="Phường/xã"
        addressLabel="Địa chỉ"
        provinceName="address.provinceId"
        districtName="address.districtId"
        wardName="address.wardId"
        addressName="address.street"
        required
        // isLabelNoAsterisk
        notRequiredWard
      />
      <div className="flex flex-row items-center">
        <TextRequired />
        <Form.Footer submitText={address?.id ? "Lưu thay đổi" : "Tạo địa chỉ mới"} cancelText="" />
      </div>
    </Form>
  );
}
