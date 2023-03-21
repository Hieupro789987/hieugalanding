import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { CollaboratorService } from "../../../../lib/repo/collaborator.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button, Checkbox } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";

type Props = {};

export function StoreDetailRegisterCollaborator({}: Props) {
  const alert = useAlert();
  const router = useRouter();
  const toast = useToast();
  const { shopCode, shop, customer, getCustomer } = useShopContext();
  const [confirm, setConfirm] = useState(true);

  async function regisCollab() {
    try {
      await CollaboratorService.regisCollaborator();
      toast.success("Đăng ký thành công");
      await getCustomer();
      router.replace(`/store/${shopCode}/collaborator/info`);
    } catch (error) {
      switch (error.message) {
        case "Thiếu thông tin họ và tên": {
          const confirm = await alert.warn(
            "Lỗi",
            "Bạn chưa bổ sung thông tin họ tên. Đến trang thông tin để bổ sung?"
          );
          if (confirm) router.push(`/profile/account`);
          break;
        }
        default: {
          toast.info("Bạn chưa thỏa điều kiện để trở thành CTV. Lý do: " + error.message);
        }
      }
    }
  }

  useEffect(() => {
    if (!shop.config.collaborator) {
      router.replace(`/store/${shopCode}`);
    }
    if (customer && customer.isCollaborator) {
      router.replace(`/store/${shopCode}/collaborator/info`);
    }
  }, [customer, shop]);

  if (!customer) return <Spinner />;

  return (
    <div className="min-h-screen bg-white text-accent">
      <div className="my-6 main-container">
        <SectionTitle>cộng tác viên</SectionTitle>
        <h2 className="pb-2 mt-6 text-lg font-bold uppercase">Điều khoản dịch vụ</h2>
        {shop.config.colTerm ? (
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: shop.config.colTerm,
            }}
          ></div>
        ) : (
          <NotFound text="Điều khoản đang được soạn thảo" />
        )}
        <Checkbox
          className="text-sm sm:text-base -ml-1.5"
          placeholder="Tôi đồng ý với điều khoản"
          value={confirm}
          onChange={(val) => setConfirm(val)}
        />
        <Button
          text="Đăng ký"
          primary
          className="mt-8 rounded-md w-52 h-14"
          disabled={!confirm}
          onClick={async () => await regisCollab()}
        />
      </div>
    </div>
  );
}
