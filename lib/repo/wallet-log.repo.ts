import { BaseModel, CrudRepository } from "./crud.repo";

export interface WalletLog extends BaseModel {
  memberId: string;
  value: number;
  type: string;
  meta: string;
}
export class WalletLogRepository extends CrudRepository<WalletLog> {
  apiName: string = "WalletLog";
  displayName: string = "lịch sử ví tiền";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: String
    value: Float
    type: String
    meta: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: String
    value: Float
    type: String
    meta: String
  `);
}

export const WalletLogService = new WalletLogRepository();
