import { BaseModel, CrudRepository } from "../crud.repo";
import { Member, MemberService } from "../member.repo";
import { Product, ProductService } from "../product.repo";

export interface QRCodeStage extends BaseModel {
  name: string;
  description: string;
  productId: string;
  productName: string;
  qrCodeCount: number;
  scanQRCodeCount: number;
  isActive: Boolean;
  memberId: string;
  member: Member;
  product: Product;
}
export class QRCodeStageRepository extends CrudRepository<QRCodeStage> {
  apiName: string = "QRCodeStage";
  displayName: string = "Đợt QR Code";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    productName: String
    qrCodeCount: Int
    scanQRCodeCount: Int
    isActive: Boolean
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    description: String
    productId: String
    productName: String
    qrCodeCount: Int
    scanQRCodeCount: Int
    isActive: Boolean
    memberId: String
    member{
      ${MemberService.fullFragment}
    }: Member
    product{
      ${ProductService.fullFragment}
    }: Product
  `);
}

export const QRCodeStageService = new QRCodeStageRepository();
