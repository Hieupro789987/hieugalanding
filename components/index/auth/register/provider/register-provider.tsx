import { createContext, useContext, useEffect, useState } from "react";
import { AuthPhone } from "../../../../shared/auth/auth-phone";
import { AuthVerification } from "../../../../shared/auth/auth-verification";
import { ConfirmPassword } from "../../../../shared/auth/confirm-password";

export const RegisterContext = createContext<
  Partial<{
    step: any;
    setStep: Function;
  }>
>({});

export function RegisterProvider({ children }) {
  const [step, setStep] = useState<any>();

  useEffect(() => {
    setStep(REGISTER[0]);
  },[])

  return <RegisterContext.Provider value={{ step, setStep }}>{children}</RegisterContext.Provider>;
}


export const useRegister = () => useContext(RegisterContext)

export const REGISTER = [
  {
    title: "Đăng ký",
    subtitle: "",
    component: <AuthPhone type="register" />,
  },
  {
    title: "Xác minh số điện thoại",
    subtitle:
      "Mã xác minh của bạn sẽ được gửi bằng tin nhắn đến",
    component: <AuthVerification type="register"/>,
  },
  {
    title: "Tạo mật khẩu",
    subtitle: "Mật khẩu phải từ 8 ký tự trở lên",
    component: <ConfirmPassword type="register" />,
  },
];
