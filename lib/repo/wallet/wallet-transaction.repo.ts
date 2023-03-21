import { BaseModel, CrudRepository } from "../crud.repo";
import { Owner } from "../types/mixed.type";

export interface Wallet extends BaseModel {
  type: string;
  balance: string;
  owner: Owner;
}
export interface WalletTransaction extends BaseModel {
  code: string;
  walletId: string;
  type: string;
  amount: number;
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

export const WALLET_TRANSACTION_TYPE_OPTIONS: Option[] = [
  { value: "DEPOSIT", label: "Nạp tiền", color: "primary" },
  { value: "WITHDRAW", label: "Rút tiền", color: "danger" },
  { value: "ADJUST", label: "Điều chỉnh", color: "warning" },
  { value: "TRANSFER", label: "Chuyển Khoản", color: "info" },
  { value: "RECEIVE", label: "Nhận tiền", color: "success" },
];
