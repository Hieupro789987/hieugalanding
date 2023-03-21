import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FORGOT_PASSWORD,
  useForgotPassword,
} from "../../index/auth/forgotPassword/provider/forgotPassword-provider";
import { REGISTER, useRegister } from "../../index/auth/register/provider/register-provider";
import { labelAccentField } from "../common/label-accent";
import { Field, Input, Button } from "../utilities/form";
import { firebase } from "../../../lib/helpers/firebase";
import { useAuth } from "../../../lib/providers/auth-provider";
import { send } from "process";
export interface AuthVerificationProps {
  type: "register" | "forgot";
}

export function AuthVerification({ ...props }) {
  const [otpDelay, setOTPDelay] = useState(0);
  const { watch, setValue, getValues,unregister } = useFormContext();
  const { signInWithPhoneNumber } = useAuth();
  const { setStep } = props.type === "register" ? useRegister() : useForgotPassword();
  const otp: string = watch("otp");

  useEffect(() => {
    if (otp?.toString()?.length > 6) {
      setValue("otp", otp?.toString()?.slice(0, 6));
    }
  }, [otp]);

  useEffect(() => {
    if (otpDelay > 0) {
      var sub = setTimeout(() => {
        setOTPDelay(otpDelay - 1);
      }, 1000);
    }
    return () => clearTimeout(sub);
  }, [otpDelay]);

  return (
    <>
      <Field className="mb-1" name="otp" label="Mã OTP" required {...labelAccentField}>
        <Input
          className=" h-14 lg:w-96"
          inputClassName="text-center font-bold"
          placeholder="Vui lòng nhập mã OTP"
          autoFocus          
        />
      </Field>
      <VerificationButton />

      <div className="text-center">
        <>
          <div className={otpDelay > 0 ? "hidden" : ""}>
            Bạn chưa nhận được mã OTP?
            <Button
              textPrimary
              text="Gửi lại"
              className="pl-1"
              unfocusable
              onClick={() => {
                setOTPDelay(250);
                signInWithPhoneNumber(getValues().phone);
              }}
            />
          </div>
        </>

        <div className={otpDelay <= 0 ? "hidden text-center" : ""}>
          Vui lòng chờ <span className="text-primary">{otpDelay}s</span> để gửi lại
        </div>
      </div>

      <Button
        textPrimary
        text="Nhập lại số điện thoại"
        className="hover:underline"
        onClick={() => {
          unregister("otp");
          props.type === "register" ? setStep(REGISTER[0]) : setStep(FORGOT_PASSWORD[0]);
        }}
        unfocusable
      />
    </>
  );
}

export function VerificationButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      submit
      primary
      className="mb-5 shadow-lg h-14 shadow-green-700/50"
      text="Tiếp theo"
      isLoading={isSubmitting}
    />
  );
}
