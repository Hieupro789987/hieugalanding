import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "../../../layouts/admin-layout/components/footer";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Spinner, NotFound } from "../../shared/utilities/misc";
import { useDevice } from "../../../lib/hooks/useDevice";
import { useFormContext } from "react-hook-form";
import { MemberService } from "../../../lib/repo/member.repo";

export default function ShopLoginPage({ regisEnabled }: { regisEnabled: boolean }) {
  const { member, loginMember, redirectToLoggedIn } = useAuth();
  const [openForgetPassword, setOpenForgetPassword] = useState(false);
  const [hasOTPSent, setHasOTPSent] = useState<string>();
  const toast = useToast();

  useEffect(() => {
    if (member) {
      redirectToLoggedIn();
    }
  }, [member]);

  useEffect(() => {
    if (!openForgetPassword) {
      setHasOTPSent("");
    }
  }, [openForgetPassword]);

  const login = async ({ username, password }) => {
    if (username && password) {
      await loginMember(username, password)
        .then((user) => {})
        .catch((err) => {
          console.error(err);
          toast.error("Đăng nhập thất bại. " + err);
        });
    }
  };
  const { isSafari } = useDevice();
  if (isSafari) return <NotFound text="Hệ thống chưa hỗ trợ trên trình duyệt này" />;

  if (member !== null) return <Spinner />;
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover w-ful"
      style={{ backgroundImage: `url(/assets/img/login-background.png)` }}
    >
      <div className="flex items-center justify-center flex-1 w-full bg-center bg-no-repeat bg-cover">
        <Form
          className="flex flex-col w-5/6 py-4 sm:w-3/12 min-w-sm max-w-screen-xs sm:py-0 sm:h-screen"
          onSubmit={async (data) => {
            await login(data);
          }}
        >
          <img className="w-32 h-auto mx-auto my-6 mt-auto" src="/assets/img/logo.png" />
          <h2 className="mt-2 mb-6 text-2xl font-bold text-center uppercase text-accent">
            Đăng nhập
          </h2>

          <Field className="mb-1" name="username" required>
            <Input
              className="border-0 rounded-lg shadow-md h-14"
              placeholder="Email đăng nhập"
              autoFocus
            />
          </Field>
          <Field className="mb-1" name="password" required>
            <Input
              className="border-0 rounded-lg shadow-md h-14"
              type="password"
              placeholder="Mật khẩu"
            />
          </Field>
          <LoginButton />
          {regisEnabled && (
            <div className="mt-5 font-medium text-center text-white">
              Bạn chưa có tài khoản?{" "}
              <Link href="/shop/register">
                <a className="font-semibold cursor-pointer text-accent hover:underline">
                  Đăng ký ngay
                </a>
              </Link>
            </div>
          )}
          <Button
            className="h-auto mt-2 text-white"
            hoverWhite
            text={"Quên mật khẩu"}
            unfocusable
            onClick={() => {
              setOpenForgetPassword(true);
            }}
          />
          <Footer className="mt-auto text-white border-gray-400" />
        </Form>
        <Form
          dialog
          title="Đổi mật khẩu"
          isOpen={openForgetPassword}
          onClose={() => {
            setOpenForgetPassword(false);
          }}
          onSubmit={async (data) => {
            if (hasOTPSent) {
              if (!data.otp || !data.password) {
                toast.info("Vui lòng nhập OTP và mật khẩu mới");
                return;
              }
              try {
                await MemberService.resetMemberPassword(hasOTPSent, data.otp, data.password);
                toast.success("Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.");
                setOpenForgetPassword(false);
              } catch (err) {
                toast.error("Đổi mật khẩu thất bại. " + err.message);
              }
            } else {
              if (!data.email) {
                toast.info("Vui lòng nhập email");
                return;
              }
              try {
                await MemberService.sendOTP(data.email);
                toast.success("Gửi OTP thành công. Xin kiểm tra hộp thư của email đã nhập.");
                setHasOTPSent(data.email);
              } catch (err) {
                toast.error("Gửi OTP thất bại. " + err.message);
              }
            }
          }}
        >
          <Field name="email" label="Email cửa hàng" readOnly={!!hasOTPSent}>
            <Input type="email" />
          </Field>
          {hasOTPSent && (
            <>
              <Field name="otp" label="Mã OTP">
                <Input />
              </Field>
              <Field name="password" label="Mật khẩu mới">
                <Input type="password" />
              </Field>
            </>
          )}
          <Form.Footer
            submitText={hasOTPSent ? "Xác nhận đổi mật khẩu" : "Nhận mã OTP qua email"}
          />
        </Form>
      </div>
    </div>
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
      className="mt-4 rounded-lg shadow h-14"
      text="Đăng nhập cửa hàng"
      isLoading={isSubmitting}
    />
  );
}
