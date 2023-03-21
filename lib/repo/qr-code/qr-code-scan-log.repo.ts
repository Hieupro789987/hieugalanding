import axios from "axios";
import { GetMemberToken } from "../../graphql/auth.link";
import { BaseModel, CrudRepository } from "../crud.repo";
import { QRCode, QRCodeService } from "./qr-code.repo";

export interface QRCodeScanLog extends BaseModel {
  qrCodeId: string;
  userName: string;
  phone: string;
  device: string;
  engine: string;
  browser: string;
  os: string;
  memberId: string;
  qrCode: QRCode;
}
export class QRCodeScanLogRepository extends CrudRepository<QRCodeScanLog> {
  apiName: string = "QRCodeScanLog";
  displayName: string = "Lịch sử quét QR Code";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    qrCodeId: String
    userName: String
    phone: String
    os: String
    memberId: String
    qrCode{
      code: String
      qrCode: String
    }: QRCode
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    qrCodeId: String
    userName: String
    phone: String
    device: String
    engine: String
    browser: String
    os: String
    memberId: String
    qrCode{
      ${QRCodeService.fullFragment}
    }: QRCode
  `);

  async qrCodeScan(id: string) {
    return await this.mutate({
      mutation: `qrCodeScan(id: $id) {
        ${this.fullFragment}
      }`,
      variablesParams: `($id: ID!)`,
      options: {
        variables: {
          id,
        },
      },
    }).then((res) => res.data["g0"]);
  }

  async exportQRCodeScanHistory(qrCodeStageId: string) {
    return axios
      .get("/api/report/exportQRCodeScanHistory", {
        params: {
          qrCodeStageId,
        },
        headers: {
          "x-token": GetMemberToken(),
        },
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }
}

export const QRCodeScanLogService = new QRCodeScanLogRepository();
