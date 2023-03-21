import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { GlobalCustomerCheckPhoneExistService } from "../../../../lib/repo/global-customer/global-check-phone.repo";
import { GlobalCustomerService } from "../../../../lib/repo/global-customer/global-customer.repo";
import { AuthenticateLayout } from "../../../shared/auth/authenticate-layout";
import { Form } from "../../../shared/utilities/form";
import { REGISTER, useRegister } from "./provider/register-provider";

export function RegisterPage() {
  const { step, setStep } = useRegister();
  const {
    signInWithPhoneNumber,
    confirmResult,
    setWrapper,
    login,
    user,
    loginGlobalCustomerByPhone,
    loginGlobalCustomerByPhoneAndPassword,
  } = useAuth();
  const captchaRef = useRef(null);
  const [tokenId, setTokenId] = useState<string>();
  const router = useRouter();
  const toast = useToast();
  const alert = useAlert();

  const handleSubmit = async ({ phone, otp, password }) => {
    try {
      if (phone) {
        const isCheckPhoneExist = await GlobalCustomerCheckPhoneExistService.globalCustomerIsPhoneExist(
          phone,
          "VN"
        );
        if (isCheckPhoneExist?.isDupplicate) {
          alert.info(
            "Số điện thoại này đã tồn tại",
            "Vui lòng dùng số điện thoại này để đăng nhập hoặc đăng ký bằng một số điện thoại mới"
          );
        } else {
          setWrapper(captchaRef.current);
          await signInWithPhoneNumber(phone);
          toast.success("Mã OTP đã được gửi đến số điện thoại của bạn");
          setStep({
            ...REGISTER[1],
            subtitle: (
              <>
                {REGISTER[1].subtitle} <span className="font-bold text-accent">{phone}</span>
              </>
            ),
          });
        }
      }
      if (otp) {
        const result = await confirmResult.confirm(otp.toString());
        const user = await result.user.getIdToken();
        await loginGlobalCustomerByPhone(user);
        setTokenId(user);
        toast.info("Xác nhận mã OTP thành công");
        setStep(REGISTER[2]);
      }
      if (password) {
        await GlobalCustomerService.changePassNotRequireOldPass(tokenId, password);
        await alert.success("Đăng ký tài khoản thành công!");
        setTimeout(() => {
          router.push("/profile/update-info");
        }, 300);
      }
    } catch (error) {
      console.log("error.code", error.code);
      switch (error.code) {
        case "auth/invalid-verification-code":
          toast.error("Mã OTP không đúng, vui lòng thử lại");
          break;
        case "auth/invalid-phone-number":
          toast.error("Số điện thoại không hợp lệ");
          break;
        case "auth/too-many-requests":
          toast.error("Bạn đã thực hiện quá nhiều yêu cầu");
          break;
        case "auth/code-expired":
          toast.error("Mã OTP đã hết hạn", "Vui lòng gửi lại mã xác minh để thử lại.");
          break;
        default:
          toast.error("Đã xảy ra lỗi. ", error.message);
      }
    }
  };

  return (
    <>
      <AuthenticateLayout user="endUser" title={step?.title} subTitle={step?.subtitle}>
        <Form
          width={383}
          className="flex flex-col pt-4 m-auto lg:p-5 lg:bg-white lg:rounded lg:shadow-xl max-w-screen-xs"
          onSubmit={handleSubmit}
        >
          {step?.component}
        </Form>
      </AuthenticateLayout>
      <div id="wrapper" ref={captchaRef}>
        <div id="recaptcha-container"></div>
      </div>
    </>
  );
}
