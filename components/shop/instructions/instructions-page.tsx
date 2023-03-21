import firebase from "firebase";
import { useRef, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useShopLayoutContext } from "../../../layouts/shop-layout/providers/shop-layout-provider";
import { parseAddress } from "../../../lib/helpers/parser";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { CategoryService } from "../../../lib/repo/category.repo";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { ShopCategoryService } from "../../../lib/repo/shop-category.repo";
import { STAFF_SCOPES } from "../../../lib/repo/staff.repo";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { AddressFields, Spinner } from "../../shared/utilities/misc";
import { BranchLocationDialog } from "../branches/components/branch-location-dialog";
import { InstructionsProvider, useInstructionsContext } from "./providers/instructions-provider";

export function InstructionPage() {
  const { handleCompleteInstruction } = useShopLayoutContext();

  {
    return (
      <InstructionsProvider onComplete={() => handleCompleteInstruction()}>
        <InstructionForm />
      </InstructionsProvider>
    );
  }
}
function InstructionForm() {
  const { handleCompleteInstruction } = useShopLayoutContext();
  const { handleSubmit, defaultValues, step } = useInstructionsContext();
  const { logoutMember } = useAuth();

  if (step < 0) return <Spinner />;

  return (
    <>
      <Form
        className="relative flex flex-col items-center w-full max-w-xl px-6 pt-2 pb-4 mx-auto my-20 text-gray-700 bg-white shadow min-h-xl"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between w-full border-b border-gray-200">
          <img src="/assets/img/logo.png" className="object-contain w-auto h-8" />
          <div className="relative py-4 text-lg font-bold text-gray-600 uppercase">
            Hướng dẫn tạo cửa hàng
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full">
          <Instructions />
          <InstructionsFooter />
        </div>
        <FormSpinner />
        <div className="absolute flex justify-between w-full -bottom-8">
          <Button
            className="h-auto text-sm underline hover:underline"
            text={"Đăng nhập bằng tài khoản khác"}
            onClick={() => {
              logoutMember();
            }}
          />
          <Button
            className="h-auto text-sm underline hover:underline"
            text={"Bỏ qua bước thiết lập"}
            onClick={() => {
              handleCompleteInstruction(true);
            }}
          />
        </div>
      </Form>
    </>
  );
}

function FormSpinner() {
  const { isSubmitting } = useFormState();

  if (!isSubmitting) return null;
  return (
    <div className="absolute top-0 left-0 z-40 flex items-center w-full h-full bg-gray-100 bg-opacity-40 animate-emerge">
      <Spinner />
    </div>
  );
}

function InstructionsFooter() {
  const { step, prevStep, steps } = useInstructionsContext();

  return (
    <div className="flex items-center col-span-12 mt-4">
      <Button
        className="pl-2 uppercase"
        text="Trở về"
        onClick={prevStep}
        outline
        icon={<RiArrowLeftSLine />}
        iconClassName="text-2xl mb-0.5"
        disabled={step == 0}
      ></Button>
      <div className="flex-1 font-semibold text-center">
        {step + 1} / {steps?.length} bước
      </div>
      <Button
        className="pr-2 uppercase shadow bg-brand hover:bg-brand-dark"
        text={step == steps?.length - 1 ? "Hoàn thành" : "Tiếp theo"}
        primary
        submit
        icon={<RiArrowRightSLine />}
        iconClassName="text-2xl mb-0.5"
        iconPosition="end"
      ></Button>
    </div>
  );
}

function Instructions() {
  const { watch } = useFormContext();
  const data = watch();
  const { step } = useInstructionsContext();
  // const step = 1;

  return (
    <div className="flex-1">
      {
        {
          0: <VerifyPhone />,
          1: <ConfigShop />,
          2: <ConfigBranch />,
          3: <ConfigNewStaff />,
          4: <ConfigNewDriver />,
          5: <ConfigNewCategory />,
          6: <ConfigNewProduct />,
        }[step]
      }
    </div>
  );
}

function InstructionTitle({ text }: { text: string }) {
  return (
    <div className="relative my-6 text-lg font-medium text-center text-gray-600 uppercase">
      {text}
      <div className="absolute w-24 h-1.5 transform -translate-x-1/2 bg-brand -bottom-2 left-1/2"></div>
    </div>
  );
}

function VerifyPhone() {
  const { member, verifyPhoneMember } = useAuth();
  const { nextStep } = useInstructionsContext();
  let [confirmResult, setConfirmResult] = useState(null);
  const captchaRef = useRef(null);
  const { watch } = useFormContext();
  const [submitting, setSubmitting] = useState(false);
  const otp = watch("otp");
  const toast = useToast();

  const getConfirmResult = async (phone: string) => {
    try {
      setSubmitting(true);
      let appVerifier = new firebase.auth.RecaptchaVerifier(captchaRef.current, {
        size: "invisible",
        callback: (response: any) => {},
      });
      confirmResult = await firebase
        .auth()
        .signInWithPhoneNumber(`+84${phone.substring(1, phone.length)}`, appVerifier);
      toast.info("Mã OTP đã được gửi đến số điện thoại trên");
    } catch (error) {
      toast.error("Đã xảy ra lỗi xác thực OTP. " + error.message);
    } finally {
      setSubmitting(false);
      setConfirmResult(confirmResult);
    }
  };
  const getTokenPhoneVerify = async (otp) => {
    try {
      setSubmitting(true);
      await confirmResult.confirm(otp).then(async (res) => {
        let idToken = await res.user.getIdToken();
        if (idToken) {
          let res = await verifyPhoneMember(idToken);
          if (res) {
            nextStep();
          }
        }
      });
    } catch (error) {
      toast.error("Đã xảy ra lỗi kích hoạt số điện thoại " + error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <InstructionTitle text="Xác thực số điện thoại" />
      {!member.phoneVerified ? (
        <>
          <div id="recaptcha-container" ref={captchaRef}></div>
          <Field
            label="Số điện thoại đăng ký"
            description="Bước này để đảm bảo số điện thoại bạn dùng chính xác"
            cols={12}
            readOnly
          >
            <Input value={member.phone} placeholder="Nhập số điện thoại" />
          </Field>
          {confirmResult && (
            <Field name="otp" label="Mã OTP được gửi qua tin nhắn" cols={12}>
              <Input />
            </Field>
          )}
          <div className="flex-center">
            {confirmResult ? (
              <Button
                text="Xác thực"
                className="bg-brand hover:bg-brand-dark"
                asyncLoading={submitting}
                onClick={async () => {
                  if (otp) {
                    await getTokenPhoneVerify(otp);
                  } else {
                    toast.info("Vui lòng nhập mã OTP");
                  }
                }}
                primary
              />
            ) : (
              <Button
                text="Nhận mã OTP"
                asyncLoading={submitting}
                className="bg-brand hover:bg-brand-dark"
                onClick={async () => {
                  await getConfirmResult(member.phone);
                }}
                primary
              />
            )}
          </div>
        </>
      ) : (
        <div className="w-full py-12 flex-center">
          <i className="pr-3 text-5xl text-success">
            <FaCheckCircle />
          </i>
          <span className="text-lg font-medium">Số điện thoại cửa hàng này đã được xác thực</span>
        </div>
      )}
    </>
  );
}
function ConfigShop() {
  return (
    <>
      <InstructionTitle text="Cấu hình cửa hàng" />
      <Field name="shopName" label="Tên cửa hàng" cols={12} required>
        <Input />
      </Field>
      <Field label="Danh mục cửa hàng" name="categoryId" cols={12} required>
        <Select optionsPromise={() => ShopCategoryService.getAllOptionsPromise()} />
      </Field>
      <Field name="shopCover" label="Ảnh nền cửa hàng (Tỉ lệ 16:9)" cols={12} required>
        <ImageInput largeImage ratio169 />
      </Field>
    </>
  );
}
function ConfigBranch() {
  const { register, watch, setValue, getValues } = useFormContext();
  const [openLocation, setOpenLocation] = useState<{
    address: string;
    location: {
      latitude: number;
      longitude: number;
    };
  }>();

  register("latitude");
  register("longitude");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  return (
    <>
      <InstructionTitle text="Cấu hình chi nhánh đầu tiên" />
      <Field name="name" label="Tên chi nhánh" required>
        <Input />
      </Field>
      <Field name="phone" label="Số điện thoại" required>
        <Input />
      </Field>
      <AddressFields
        provinceLabelName="provinceName"
        districtLabelName="districtName"
        wardLabelName="wardName"
        provinceRequired
        districtRequired
        wardRequired
      />
      <Field label="Địa chỉ (Số nhà, Đường)" name="address" required>
        <Input />
      </Field>
      <Field
        label="Toạ độ"
        onClick={() => {
          setOpenLocation({
            address: parseAddress({
              address: getValues("address"),
              province: getValues("provinceName"),
              district: getValues("districtName"),
              ward: getValues("wardName"),
            }),
            location: {
              longitude,
              latitude,
            },
          });
        }}
      >
        <Input
          inputClassName="bg-white"
          value={[latitude, longitude].filter(Boolean).join(", ") || "[Chưa có toạ độ]"}
          readOnly
        />
      </Field>
      <Field name="email" label="Email">
        <Input type="email" />
      </Field>
      <Field
        name="coverImage"
        label="Ảnh bìa chi nhánh"
        description="Tỉ lệ 16:9. Hệ thống sẽ dùng ảnh cửa hàng nếu để trống"
      >
        <ImageInput ratio169 cover largeImage />
      </Field>
      <BranchLocationDialog
        isOpen={!!openLocation}
        onClose={() => setOpenLocation(null)}
        address={openLocation?.address}
        location={openLocation?.location}
        onSelectLocation={({ latitude, longitude }) => {
          setValue("latitude", latitude);
          setValue("longitude", longitude);
        }}
      />
    </>
  );
}

function ConfigNewStaff() {
  const { member } = useAuth();
  const { register } = useFormContext();
  register("password");

  return (
    <>
      <InstructionTitle text="Tài khoản nhân viên" />
      <Field name="name" label="Tên nhân viên" required>
        <Input />
      </Field>
      <Field name="branchId" label="Cửa hàng trực thuộc" required>
        <Select optionsPromise={() => ShopBranchService.getAllOptionsPromise()} />
      </Field>
      <Field label="Mã cửa hàng" readOnly>
        <Input value={member.code} />
      </Field>
      <Field name="username" label="Tên đăng nhập">
        <Input />
      </Field>
      <Field name="phone" label="Số điện thoại">
        <Input />
      </Field>
      <Field name="address" label="Địa chỉ">
        <Input />
      </Field>
      <Field name="avatar" label="Avatar">
        <ImageInput avatar />
      </Field>
      <Field name="scopes" label="Quyền hạn">
        <Select multi options={STAFF_SCOPES} />
      </Field>
    </>
  );
}
function ConfigNewDriver() {
  return (
    <>
      <InstructionTitle text="Tài xế nội bộ" />
      <Field name="name" label="Tên tài xế" required>
        <Input />
      </Field>
      <Field name="phone" label="Số điện thoại" className="mr-4" required>
        <Input />
      </Field>
      <Field name="licensePlates" label="Biển số xe" required>
        <Input />
      </Field>
      <Field name="avatar" label="Avatar">
        <ImageInput avatar />
      </Field>
    </>
  );
}

function ConfigNewCategory() {
  return (
    <>
      <InstructionTitle text="Danh mục sản phẩm" />
      <Field name="name" label="Tên danh mục" required>
        <Input />
      </Field>
      <Field name="priority" label="Độ ưu tiên">
        <Input number defaultValue={1} />
      </Field>
    </>
  );
}

function ConfigNewProduct() {
  return (
    <>
      <InstructionTitle text="Sản phẩm" />
      <Field name="name" label="Tên sản phẩm" required>
        <Input />
      </Field>
      <Field label="Danh mục" name="categoryId" required>
        <Select optionsPromise={() => CategoryService.getAllOptionsPromise()} />
      </Field>
      <Field name="basePrice" label="Giá bán" required>
        <Input number currency />
      </Field>
    </>
  );
}
