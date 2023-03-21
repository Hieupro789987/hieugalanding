import { createContext, useContext, useEffect, useState } from "react";
import { AuthPhone } from "../../../../shared/auth/auth-phone";
import { AuthVerification } from "../../../../shared/auth/auth-verification";
import { ConfirmPassword } from "../../../../shared/auth/confirm-password";

export const ForgotPasswordContext = createContext<
  Partial<{
    step: any;
    setStep: Function;
  }>
>({});

export function ForgotPasswordProvider({ children }) {
  const [step, setStep] = useState<any>();

  useEffect(() => {
    setStep(FORGOT_PASSWORD[0]);
  },[])

  return <ForgotPasswordContext.Provider value={{ step, setStep }}>{children}</ForgotPasswordContext.Provider>;
}


export const useForgotPassword = () => useContext(ForgotPasswordContext)

export const FORGOT_PASSWORD = [
  {
    title: "Đặt lại mật khẩu",
    subtitle: "",
    component: <AuthPhone type="forgot" />,
  },
  {
    title: "Đặt lại mật khẩu",
    subtitle:
      "Mã xác minh của bạn sẽ được gửi bằng tin nhắn đến",
    component: <AuthVerification  type="forgot"/>,
  },
  {
    title: "Thiết lập mật khẩu",
    subtitle: "Mật khẩu phải từ 8 ký tự trở lên",
    component: <ConfirmPassword type="forgot" />,
  },
];
