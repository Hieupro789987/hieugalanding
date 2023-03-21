import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";
import { uploadImage } from "../../../lib/helpers/image";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Expert, ExpertService } from "../../../lib/repo/expert/expert.repo";
import {
  GlobalCustomer,
  GlobalCustomerService,
} from "../../../lib/repo/global-customer/global-customer.repo";
import { Staff } from "../../../lib/repo/staff.repo";
import { Writer, WriterService } from "../../../lib/repo/writer/writer.repo";
import { CloseButtonHeaderDialog } from "../dialog/close-button-header-dialog";
import { TitleDialog } from "../dialog/title-dialog";
import { Dialog } from "../utilities/dialog";
import { Button, Form, FormProps } from "../utilities/form";
import { Img, Spinner } from "../utilities/misc";

export interface AvatarDialogProps extends FormProps {
  userType?: GlobalCustomer | Expert | Writer | Staff;
}

export function ChangeAvatarDialog({ userType, ...props }: AvatarDialogProps) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setGlobalCustomer,
    setExpert,
    setWriter,
    globalCustomer,
    expert,
    writer,
    staff,
    staffUpdateMe,
  } = useAuth();
  const toast = useToast();

  const handleUploadAvatar = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      setLoading(true);
      const file = input.files[0];
      try {
        const res = await uploadImage(file);
        setAvatar(res.link);
      } catch (err) {
        console.error(err);
        toast.error("Upload ảnh đại diện thất bại", err.message);
      } finally {
        setLoading(false);
      }
    };
  };

  const handleSubmitUploadAvatar = async () => {
    try {
      if (userType?.id == globalCustomer?.id) {
        const customer = await GlobalCustomerService.globalCustomerUpdateMe({ avatar: avatar });
        await setGlobalCustomer(customer);
      }

      if (userType?.id == expert?.id) {
        const expert = await ExpertService.updateExpertSelf({
          name: userType?.name,
          avatar: avatar,
        });
        await setExpert(expert);
      }

      if (userType?.id == writer?.id) {
        const writer = await WriterService.updateWriterSelf(userType?.id, {
          name: userType?.name,
          avatar: avatar,
        });
        await setWriter(writer);
      }

      if (userType?.id == writer?.id) {
        const writer = await WriterService.updateWriterSelf(userType?.id, {
          name: userType?.name,
          avatar: avatar,
        });
        await setWriter(writer);
      }

      if (userType?.id == staff?.id) {
        await staffUpdateMe({
          avatar: avatar,
        });
      }

      props.onClose();
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật ảnh đại diện thất bại", error.message);
    }
  };

  useEffect(() => {
    return () => {
      setAvatar("");
    };
  }, [props.isOpen]);

  if (userType === undefined || userType === null) return <Spinner />;

  return (
    <>
      {router.pathname.includes("/update-info") ? (
        <Dialog width={500} {...props}>
          <div className="p-5">
            <BodyUploadInfo
              userType={userType}
              onClickAvatar={(src) => setAvatar(src)}
              avatar={avatar}
              handleUploadAvatar={handleUploadAvatar}
              onClose={props.onClose}
              loading={loading}
            />
          </div>
        </Dialog>
      ) : (
        <Form dialog width={500} {...props} onSubmit={handleSubmitUploadAvatar}>
          <BodyUploadInfo
            userType={userType}
            onClickAvatar={(src: string) => setAvatar(src)}
            avatar={avatar}
            handleUploadAvatar={handleUploadAvatar}
            onClose={props.onClose}
            loading={loading}
          />
          <Form.Footer
            cancelText=""
            className="w-full mt-6 shadow-lg shadow-green-700/50"
            submitProps={{
              className: "w-full h-14",
            }}
            submitText={"Cập nhật avatar"}
          />
        </Form>
      )}
    </>
  );
}

export function BodyUploadInfo({ ...props }) {
  const screenLg = useScreen("lg");
  const router = useRouter();
  const { setValue, register, getValues } = useFormContext();

  useEffect(() => {
    if (router.pathname.includes("/update-info")) {
      register("avatar");
      props.onClickAvatar(AVATARS_DEFAULT[0]);
    }
  }, []);

  return (
    <>
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <Img
        default={props.userType?.avatar ?? props.avatar}
        src={props.avatar}
        className="w-[36%] mx-auto rounded-full"
        imageClassName="rounded-full"
      />
      <TitleDialog
        title="Đổi avatar"
        subtitle="Chọn avatar hoặc tải lên"
        className="mt-4"
        subtitleClassName="mt-0 text-neutralGrey"
      />
      <div className={`grid ${screenLg ? "grid-cols-5" : "grid-cols-4"}  gap-6 `}>
        <Button
          icon={<BiImageAdd />}
          iconClassName="text-3xl"
          className="flex items-center justify-center border border-black border-dotted rounded-full lg:w-18 w-[75px] h-[75px]"
          onClick={() => props.handleUploadAvatar()}
          isLoading={props.loading}
        />

        {AVATARS_DEFAULT.map((src, index) => (
          <Img
            avatar
            src={src}
            key={index}
            rounded
            lazyload={false}
            className={` ${
              (props.avatar || getValues()?.avatar || props.userType?.avatar) === src
                ? "border-2 p-1 border-primary rounded-full"
                : ""
            }`}
            onClick={() => props.onClickAvatar(src)}
          />
        ))}
      </div>
      {router.pathname.includes("/update-info") && (
        <Button
          primary
          text="Xác nhận"
          className="w-full mt-6 shadow-lg shadow-green-700/50 h-14"
          onClick={() => {
            setValue("avatar", props.avatar);
            props.onClose();
          }}
        />
      )}
    </>
  );
}

export const AVATARS_DEFAULT = [
  "/assets/img/avatar-15.png",
  "/assets/img/avatar-1.png",
  "/assets/img/avatar-3.png",
  "/assets/img/avatar-2.png",
  "/assets/img/avatar-11.png",
  "/assets/img/avatar-4.png",
  "/assets/img/avatar-5.png",
  "/assets/img/avatar-6.png",
  "/assets/img/avatar-8.png",
  "/assets/img/avatar-7.png",
  "/assets/img/avatar-9.png",
  "/assets/img/avatar-12.png",
  "/assets/img/avatar-10.png",
  "/assets/img/avatar-14.png",
  "/assets/img/avatar-13.png",
];
