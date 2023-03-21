import { BaseModel, CrudRepository } from "../crud.repo";
import { GlobalCustomer } from "./global-customer.repo";

export interface ReferralCustomer extends BaseModel {
  refCustomerId?: string; // Mã Người Giới Thiệu
  customerId?: string; // Mã khách hàng
  name?: string; // Tên Người Giới Thiệu
  phone?: string; // Số điện thoại Người Giới Thiệu
  avatar?: string; // Avatar Người Giới Thiệu

  refCustomer?: GlobalCustomer; // Người giới thiệu
  customer?: GlobalCustomer; // Khách hàng
  commissionBalance?: number; // Số tiền hoa hồng
}
export class ReferralCustomerRepository extends CrudRepository<ReferralCustomer> {
  apiName: string = "ReferralCustomer";
  displayName: string = "Khách hàng";
  shortFragment: string = this.parseFragment(`
    id createdAt
    refCustomerId: ID
    customerId: ID
    name: String
    phone: String
    avatar: String
    commissionBalance: Float
  `);
  fullFragment: string = this.parseFragment(`
    id createdAt
    refCustomerId: ID
    customerId: ID
    name: String
    phone: String
    avatar: String
  `);

  async recordReferralCustomer(refId: string) {
    return this.mutate({
      mutation: `recordReferralCustomer(refId: "${refId}")`,
      token: "global-customer",
    }).then((res) => res.data.g0);
  }
}

export const ReferralCustomerService = new ReferralCustomerRepository();
