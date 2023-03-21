import { useEffect, useRef, useState } from "react";
import { AuthenticateLayout } from "../../../shared/auth/authenticate-layout";
import { Form } from "../../../shared/utilities/form";
import { firebase } from "../../../../lib/helpers/firebase";
import { useToast } from "../../../../lib/providers/toast-provider";
import { EndUserService } from "../../../../lib/repo/end-user.repo";
import { useRouter } from "next/router";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { GlobalCustomerService } from "../../../../lib/repo/global-customer/global-customer.repo";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { FORGOT_PASSWORD, useForgotPassword } from "./provider/forgotPassword-provider";
import { GlobalCustomerCheckPhoneExistService } from "../../../../lib/repo/global-customer/global-check-phone.repo";

export function ForgotPasswordPage() {
  const { step, setStep } = useForgotPassword();
  const { signInWithPhoneNumber, confirmResult, verifier, setWrapper } = useAuth();
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
        if (!isCheckPhoneExist?.isDupplicate) {
          alert.info(
            "Số điện thoại này chưa đăng ký",
            "Vui lòng đăng ký mới bằng số điện thoại này hoặc nhập một số điện thoại đã đăng ký"
          );
        } else {
          setWrapper(captchaRef.current);
          await signInWithPhoneNumber(phone);
          toast.success("Mã OTP đã được gửi đến số điện thoại của bạn");

          setStep({
            ...FORGOT_PASSWORD[1],
            subtitle: (
              <>
                {FORGOT_PASSWORD[1].subtitle} <span className="font-bold text-accent">{phone}</span>
              </>
            ),
          });
        }
      }
      if (otp) {
        const result = await confirmResult.confirm(otp.toString());
        const user = await result.user.getIdToken();
        setTokenId(user);
        toast.success("Xác nhận mã OTP thành công");
        setStep(FORGOT_PASSWORD[2]);
      }
      if (password) {
        await GlobalCustomerService.changePassNotRequireOldPass(tokenId, password);
        toast.success("Thiết lập mật khẩu thành công");
        await alert.success(
          "Thiết lập mật khẩu thành công!",
          "Vui lòng đăng nhập lại với mật khẩu mới"
        );
        router.push("/login");
      }
    } catch (error) {
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
          className="flex flex-col pt-8 m-auto lg:p-5 lg:bg-white lg:rounded lg:shadow-xl max-w-screen-xs"
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
