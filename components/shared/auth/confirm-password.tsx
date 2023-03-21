import { useFormContext } from "react-hook-form";
import { FORGOT_PASSWORD, useForgotPassword } from "../../index/auth/forgotPassword/provider/forgotPassword-provider";
import { REGISTER, useRegister } from "../../index/auth/register/provider/register-provider";
import { labelAccentField } from "../common/label-accent";
import { Field, Input, Button } from "../utilities/form";

export interface ConfirmPasswordProps {
  type: "register" | "forgot";
}
// export function ConfirmPasswordForm({ type, ...props }: ConfirmPasswordProps) {
//   return (
//     <Form className="flex flex-col p-5 pt-8 bg-white rounded shadow-xl max-w-screen-xs">
//       <Field
//         className="mb-1"
//         name="password"
//         required
//         validation={{
//           password: true,
//         }}
//       >
//         <Input
//           className="h-14 w-96"
//           placeholder={`Nhập ${type === "create" ? "mật khẩu mới" : "mật khẩu cũ"}`}
//           autoFocus
//           type="password"
//         />
//       </Field>
//       <Field
//         className="mb-1"
//         name="confirmPassword"
//         required
//         validation={{
//           password: true,
//           checkPassword: (_, data) => {
//             if (data.password !== data.confirmPassword) {
//               return "Mật khẩu không trùng khớp!";
//             }
//           },
//         }}
//       >
//         <Input
//           className="h-14 w-96"
//           placeholder={`Nhập ${type === "create" ? "lại mật khẩu mới" : "mật khẩu mới"}`}
//           autoFocus
//           type="password"
//         />
//       </Field>
//       <PasswordButton />
//       {/* <div className="text-center">
//         <Link href="/register">
//           <a className="mb-3 font-bold text-center text-primary hover:text-primary hover:underline">
//            Quay lại trang OTP
//           </a>
//         </Link>
//       </div> */}
//     </Form>
//   );
// }

export function ConfirmPassword({ type, ...props }: ConfirmPasswordProps) {
  const { setStep } = type === "register" ? useRegister() : useForgotPassword();

  const { unregister } = useFormContext();
  return (
    <>
      <Field
        className="mb-1"
        name="password"
        label="Mật khẩu"
        required
        validation={{
          password: true,
        }}
        labelNoAsterisk
        {...labelAccentField}
      >
        <Input
          className="h-14 lg:w-96"
          placeholder="Vui lòng nhập mật khẩu"
          autoFocus
          type="password"
        />
      </Field>
      <PasswordButton type={type} />
      <Button
        textPrimary
        text="Nhập lại số điện thoại"
        className="hover:underline"
        onClick={() => {
          unregister("password");
          type === "register" ? setStep(REGISTER[0]) : setStep(FORGOT_PASSWORD[0]);
        }}
        unfocusable
      />
    </>
  );
}

export function PasswordButton({ ...props }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button
      submit
      primary
      className="w-full mb-5 shadow-lg h-14 shadow-green-700/50 "
      text={props.type === "register" ? "Đăng ký" : "Đặt lại mật khẩu"}
      isLoading={isSubmitting}
    />
  );
}
