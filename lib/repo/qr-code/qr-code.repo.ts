import axios from "axios";
import { GetMemberToken } from "../../graphql/auth.link";
import { BaseModel, CrudRepository } from "../crud.repo";
import { QRCodeStage, QRCodeStageService } from "./qr-code-stage.repo";

export interface QRCode extends BaseModel {
  qrCodeStageId: string;
  qrCode: string;
  code: string;
  targetType: string;
  targetId: string;
  scanCount: number;
  isActive: Boolean;
  memberId: string;
  qrCodeStage: QRCodeStage;
  lastScanAt: string;
}
export class QRCodeRepository extends CrudRepository<QRCode> {
  apiName: string = "QRCode";
  displayName: string = "QR Code";
  shortFragment: string = this.parseFragment(`
    id: String
    updatedAt: DateTime
    qrCodeStageId: String
    qrCode: String
    code: String
    scanCount: Int
    isActive: Boolean
    qrCodeStage{
      id name
    }: QRCodeStage
    lastScanAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    qrCodeStageId: String
    qrCode: String
    code: String
    targetType: String
    targetId: String
    scanCount: Int
    isActive: Boolean
    memberId: String
    qrCodeStage{
      ${QRCodeStageService.fullFragment}
    }: QRCodeStage
    lastScanAt: DateTime
  `);

  async exportListQRCode(qrCodeStageId: string) {
    return axios
      .get("/api/report/exportListQRCode", {
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

  async exportQRCodeScanLogDetail(qrCodeId: string) {
    return axios
      .get("/api/report/exportQRCodeScanLogDetail", {
        params: {
          qrCodeId,
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

  async exportQRCodePNG(qrCodeStageId: string) {
    return axios
      .get("/api/report/exportQRCodePNGZip", {
        params: {
          qrCodeStageId,
        },
        headers: {
          "x-token": GetMemberToken(),
        },
        responseType: "arraybuffer",
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err.response.data;
      });
  }
}

export const QRCodeService = new QRCodeRepository();
