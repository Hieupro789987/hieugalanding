import { useAlert } from "../../../lib/providers/alert-provider";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { labelAccentField } from "../common/label-accent";
import { CloseButtonHeaderDialog } from "../dialog/close-button-header-dialog";
import { TitleDialog } from "../dialog/title-dialog";
import { FormProps, Form, Field, Input } from "../utilities/form";


export function ChangePasswordDialog({...props }: FormProps) {
  const toast = useToast()
  const alert = useAlert();
  const { updatePasswordSelf, logout } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
    const res = await updatePasswordSelf(oldPassword, newPassword);
    await alert.success("Đổi mật khẩu thành công!", "Vui lòng đăng nhập lại với mật khẩu mới");
    logout();
    } catch (err) {
      console.log(err);
      toast.error(`Đổi mật khẩu thất bại ${err.message}`);
    }
  };

  return (
    <Form
      {...props}
      width="500px"
      dialog
      onSubmit={handleSubmit}
      className="text-accent"
    >
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Thay đổi mật khẩu" subtitle="Vui lòng nhập đủ thông tin để tiếp tục" />
      <Field label="Mật khẩu cũ" name="oldPassword" required {...labelAccentField}>
        <Input type="password" placeholder="Vui lòng nhập mật khẩu cũ..." autoFocus />
      </Field>
      <Field
        label="Mật khẩu mới"
        name="newPassword"
        validation={{
          password: true,
        }}
        required
        {...labelAccentField}
      >
        <Input type="password" placeholder="Vui lòng nhập mật khẩu mới..." />
      </Field>
      <Form.Footer submitText="Đổi mật khẩu" submitProps={{ large: true }} />
    </Form>
  );
}
