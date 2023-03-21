import axios from "axios";
import { GetUserToken } from "../graphql/auth.link";
import { BaseModel, CrudRepository } from "./crud.repo";
import { SubscriptionRequest } from "./subscription-request.repo";

export interface ShopSubscription extends BaseModel {
  memberId: string;
  plan: "FREE" | "MONTH" | "YEAR";
  expiredAt: Date;
  remindExpiredAt: Date;
  remindLockAt: Date;
  lockedAt: Date;
  fee: number;
  estimate: any;

  request: SubscriptionRequest;
}

export class ShopSubscriptionRepository extends CrudRepository<ShopSubscription> {
  apiName: string = "ShopSubscription";
  displayName: string = "đăng ký dịch vụ";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    plan: String
    expiredAt: DateTime
    remindExpiredAt: DateTime
    remindLockAt: DateTime
    lockedAt: DateTime
    fee: Float
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    plan: String
    expiredAt: DateTime
    remindExpiredAt: DateTime
    remindLockAt: DateTime
    lockedAt: DateTime
    fee: Float
    estimate: Mixed

    request { payment { method status }}
  `);
  async extendSubscription(memberId: string, plan: string): Promise<ShopSubscription> {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation{
          extendSubscription(memberId: "${memberId}" plan:"${plan}"){
           ${this.shortFragment}
          }
        }`,
      })
      .then((res) => res.data.g0 as ShopSubscription);
  }
}
export const ShopSubscriptionService = new ShopSubscriptionRepository();

export const SUBSCRIPTION_PLANS: Option[] = [
  { value: "FREE", label: "Miễn phí", color: "success" },
  { value: "MONTH", label: "Gói tháng", color: "info" },
  { value: "YEAR", label: "Gói năm", color: "danger" },
];

export const SUBSCRIPTION_PAYMENT_STATUS: Option[] = [
  { value: "PENDING", label: "Đang chờ", color: "warning" },
  { value: "COMPLETE", label: "Đã thanh toán", color: "success" },
  { value: "NONE", label: "Đã thanh toán", color: "info" },
];
