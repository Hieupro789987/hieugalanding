import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { AuthenticateLayout } from "../../../shared/auth/authenticate-layout";
import { Button, Field, Form, Input } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";

export function LoginPage() {
  const {
    loginGlobalCustomerByPhoneAndPassword,
    globalCustomer,
    redirectToGlobalCustomer,
  } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const handleSubmit = async ({ phone, password }) => {
    try {
      await loginGlobalCustomerByPhoneAndPassword(phone, password);
    } catch (error) {
      toast.error("Đã xảy ra lỗi", error);
    }
  };

  useEffect(() => {
    if (globalCustomer) {
      redirectToGlobalCustomer();
    }
  }, [globalCustomer]);

  if (globalCustomer !== null) return <Spinner />;
  return (
    <AuthenticateLayout user="endUser" title="Đăng nhập" subTitle="Vui lòng đăng nhập để tiếp tục">
      <Form
        className="flex flex-col pt-8 lg:p-5 lg:shadow-xl lg:bg-white lg:rounded max-w-screen-xs m-auto"
        onSubmit={handleSubmit}
      >
        <Field className="mb-1" name="phone" required>
          <Input className="h-12 lg:w-96" placeholder="Số điện thoại" autoFocus />
        </Field>

        <Field className="mb-1" name="password" required>
          <Input className="h-12 lg:w-96" type="password" placeholder="Mật khẩu" />
        </Field>
        <LoginButton />
        <Link href="/forgotPassword" className="mb-5">
          <a className="mb-3 font-bold text-center text-primary hover:text-primary hover:underline">
            Quên mật khẩu?
          </a>
        </Link>
        <div className="text-center">
          Bạn chưa có tài khoản?{" "}
          <Link href="/register">
            <a className="mb-3 font-bold text-center text-primary hover:text-primary hover:underline">
              Đăng kí ngay!
            </a>
          </Link>
        </div>
      </Form>
    </AuthenticateLayout>
  );
}
function LoginButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      submit
      primary
      className="mb-5 shadow-lg h-14 shadow-green-700/50"
      text="Đăng nhập"
      isLoading={isSubmitting}
    />
  );
}
