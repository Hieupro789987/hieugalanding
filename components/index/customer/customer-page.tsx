import React, { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaChevronLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaPhoneAlt,
  FaUserAlt,
} from "react-icons/fa";
import { RiFileChartLine } from "react-icons/ri";
import { parseNumber } from "../../../lib/helpers/parser";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { DatePicker } from "../../shared/utilities/form/date";
import { Img, Spinner } from "../../shared/utilities/misc";
import { AvatarUploader } from "../../shared/utilities/uploader/avatar-uploader";
import { AddressGoogleDialog } from "../../shared/location/address-google-dialog";
import { RewardPointDialog } from "./components/reward-point-dialog";
import {
  CustomerContext,
  CustomerProvider,
  useCustomerContext,
} from "./provider/customer-provider";
import { PageHeader } from "../../shared/default-layout/page-header";
import { Field, Form, Input } from "../../shared/utilities/form";
import { useForm, useFormContext } from "react-hook-form";
import { useLocation } from "../../../lib/providers/location-provider";

export function CustomerPage() {
  return (
    <CustomerProvider>
      <CustomerContext.Consumer>
        {({ pageCustomer }) => (
          <div className="min-h-screen bg-white">
            <PageHeader title="Thông tin tài khoản" />
            {pageCustomer ? <CustomerInfo /> : <Spinner />}
          </div>
        )}
      </CustomerContext.Consumer>
    </CustomerProvider>
  );
}

function CustomerInfo() {
  const [openRewardLogs, setOpenRewardLogs] = useState(false);
  const { customerUpdateMe, pageCustomer, setPageCustomer } = useCustomerContext();
  const { userLocation, openLocation } = useLocation();
  const toast = useToast();

  useEffect(() => {}, [userLocation]);

  return (
    <Form
      defaultValues={pageCustomer}
      className="relative flex flex-col items-center w-full gap-2 px-4"
      onSubmit={async (data) => {
        try {
          await customerUpdateMe(data);
          toast.success("Cập nhật thông tin tài khoản thành công");
        } catch (err) {
          toast.error("Cập nhật thông tin tài khoản thất bại. " + err.message);
        }
      }}
    >
      <CustomerAvatar />
      <div className="flex flex-col items-center w-full gap-2 my-2 xs:justify-between xs:flex-row">
        <div>
          Tổng điểm thưởng:
          <span className="ml-1 font-medium text-accent">
            {parseNumber(pageCustomer.rewardPointStats.total)} điểm
          </span>
        </div>
        <Button medium text="Lịch sử điểm thưởng" outline onClick={() => setOpenRewardLogs(true)} />
      </div>
      <div className="w-full">
        <Field name="phone" readOnly>
          <Input suffix={<FaPhoneAlt />} placeholder="Số điện thoại" />
        </Field>
        <Field name="name">
          <Input suffix={<FaUserAlt />} placeholder="Họ và tên" />
        </Field>
        <Field name="birthday">
          <DatePicker placeholder="Ngày sinh" />
        </Field>
        <CustomerAddressField />
        <Field name="addressNote">
          <Input suffix={<FaEdit />} placeholder="Ghi chú địa chỉ" />
        </Field>
      </div>
      <SubmitButton />
      <RewardPointDialog
        slideFromBottom="all"
        mobileSizeMode
        isOpen={openRewardLogs}
        onClose={() => setOpenRewardLogs(false)}
      />
    </Form>
  );
}

function CustomerAvatar() {
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { watch, setValue } = useFormContext();
  const avatar: string = watch("avatar");

  return (
    <>
      <Img avatar src={avatar} className="w-24 mb-6" lazyload={false}>
        <Button
          onClick={() => {
            avatarUploaderRef.current().onClick();
          }}
          outline
          className="absolute px-3 text-xs bg-white rounded-full h-7 -bottom-6 whitespace-nowrap"
          icon={<FaCamera />}
          text="Đổi avatar"
          isLoading={uploadingAvatar}
        />
      </Img>
      <AvatarUploader
        onRef={(ref) => {
          avatarUploaderRef.current = ref;
        }}
        onUploadingChange={setUploadingAvatar}
        onImageUploaded={(val) => {
          setValue("avatar", val);
        }}
      />
    </>
  );
}

function CustomerAddressField() {
  const [openAddress, setOpenAddress] = useState(false);
  const { watch, setValue, register } = useFormContext();
  const fullAddress: string = watch("fullAddress");
  register("latitude");
  register("longitude");

  return (
    <>
      <Field
        name="fullAddress"
        onClick={() => {
          setOpenAddress(true);
        }}
      >
        <Input suffix={<FaMapMarkerAlt />} placeholder="Địa chỉ" />
      </Field>
      <AddressGoogleDialog
        title="Nhập địa chỉ"
        slideFromBottom="all"
        mobileSizeMode
        isOpen={openAddress}
        fullAddress={fullAddress}
        onClose={() => setOpenAddress(false)}
        onChange={(data) => {
          setValue("fullAddress", data.fullAddress);
          setValue("latitude", data.lat);
          setValue("longitude", data.lng);
          setOpenAddress(false);
        }}
      />
    </>
  );
}

function SubmitButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button
      className="h-12 px-8 rounded-full shadow"
      primary
      submit
      isLoading={isSubmitting}
      text="Lưu thay đổi"
    />
  );
}
