import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { labelAccentField } from "../common/label-accent";
import { Field, Input, Button } from "../utilities/form";

export interface AuthPhoneProps {
  type: "register" | "forgot";
}

export function AuthPhone({ ...props }: AuthPhoneProps) {
  return (
    <>
      <Field
        name="phone"
        label="Số điện thoại"
        required
        labelNoAsterisk
        validation={{
          phone: true,
        }}
        {...labelAccentField}
      >
        <Input className="h-14 lg:w-96" placeholder="Vui lòng nhập số điện thoại" autoFocus />
      </Field>
      <RegisterButton />
      <div className="text-center">
        {props.type === "register" ? (
          <>
            Bạn đã có tài khoản?{" "}
            <Link href="/login">
              <a className="mb-3 font-extrabold text-center text-primary hover:text-primary hover:underline">
                Đăng nhập!
              </a>
            </Link>
          </>
        ) : (
          <Button
            textPrimary
            className="mb-5 hover:text-primary hover:underline"
            text="Quay lại trang đăng nhập"
            href="/login "
          />
        )}
      </div>
    </>
  );
}
export function RegisterButton({ ...props }) {
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
