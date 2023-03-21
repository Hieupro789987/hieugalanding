import { BaseModel, CrudRepository } from "./crud.repo";
export interface WalletTransaction extends BaseModel {
  code: string;
  walletId: string;
  type: string;
  amount: string;
  note: string;
  extra: any;
  fromWalletId: string;
  toWalletId: string;
}

export class WalletTransactionRepository extends CrudRepository<WalletTransaction> {
  apiName: string = "WalletTransaction";
  displayName: string = "Lịch sử hoa hồng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    walletId: String
    type: String
    amount: Float
    note: String
    extra: Mixed
    fromWalletId: ID
    toWalletId: ID
  `);
  fullFragment: string = this.parseFragment(`
  id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    walletId: String
    type: String
    amount: Float
    note: String
    extra: Mixed
    fromWalletId: ID
    toWalletId: ID
  `);
}
export const WalletTransactionService = new WalletTransactionRepository();
