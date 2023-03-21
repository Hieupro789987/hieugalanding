import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetMemberToken } from "../../../lib/graphql/auth.link";
import { useAuth } from "../../../lib/providers/auth-provider";
import { QRCodeScanLogService } from "../../../lib/repo/qr-code/qr-code-scan-log.repo";
import { Spinner } from "../../shared/utilities/misc";

export function QrPage() {
  const router = useRouter();
  const { globalCustomer } = useAuth();

  const scanQrCode = async () => {
    try {
      const id = router.query?.id as string;
      const res = await QRCodeScanLogService.qrCodeScan(id);

      if (res) {
        const isActive = res.qrCode?.isActive & res.qrCode?.qrCodeStage?.isActive;
        if (!isActive) {
          router.push("/qr-inactive");
        } else {
          const product = res.qrCode?.qrCodeStage?.product;
          const member = res.qrCode?.qrCodeStage?.member;
          router.push(`/store/${member?.code}/product/${product?.code}`);
        }
      } else {
        router.push("/qr-inactive");
      }
    } catch (error) {
      console.log("error: ", error);
      router.push("/qr-inactive");
    }
  };

  useEffect(() => {
    if (globalCustomer !== undefined && router.query.id) {
        if (!!router.query?.id) {
          scanQrCode();
        } else {
          router.push("/qr-inactive");
        }
    }
  }, [globalCustomer, router.query?.id]);

  return (
    <div className="my-auto main-container">
      <Spinner className="py-10" />
      <div className="w-full font-semibold text-center lg:text-xl">
        Vui lòng đợi trong giây lát...
      </div>
    </div>
  );
}
