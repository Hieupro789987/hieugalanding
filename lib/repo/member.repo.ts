import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { ShopCategory } from "./shop-category.repo";
import { ShopSubscription, ShopSubscriptionService } from "./shop-subscription.repo";
import { Thread } from "./thread.repo";
import { Wallet } from "./wallet/wallet-transaction.repo";

export type ShopType = "ENTERPRISE" | "SALE_POINT";
interface Branch extends BaseModel {
  name: string;
}

export interface StoreProvince {
  province: string;
  provinceId: string;
  shopIds: string[];
}

interface Position extends BaseModel {
  name: string;
}

interface SubscriberInfo {
  id: string;
  psid: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  locale: string;
  profilePic: string;
}

export interface Member extends BaseModel {
  code: string;
  username: string;
  uid: string;
  name: string;
  avatar: string;
  phone: string;
  fanpageId: string;
  fanpageName: string;
  fanpageImage: string;
  shopName: string;
  shopLogo: string;
  shopCover: string;
  cumulativePoint: number;
  diligencePoint: number;
  commission: number;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  province: string;
  district: string;
  ward: string;
  identityCardNumber: string;
  gender: string;
  birthday: string;
  parentIds: string[];
  activedAt: string;
  activated: boolean;
  type: string;
  branchId: string;
  positionId: string;
  psids: string[];
  phoneVerified: boolean;
  chatbotStory: {
    pageId: string;
    storyId: string;
    name: string;
    isStarted: boolean;
    isUseRef: boolean;
    ref: string;
    message: string;
    btnTitle: string;
    type: string;
    image: string;
  }[];
  allowSale: boolean;
  shopType?: String;
  branch: Branch;
  position: Position;
  parents: Member[];
  subscribers: SubscriberInfo[];
  chatbotRef: string;
  shopUrl: string;
  ordersCount: number;
  toMemberOrdersCount: number;
  deliveryDistricts: string[];
  categoryId: string;
  category: ShopCategory;
  subscription: ShopSubscription;
  threadId: string;
  thread: Thread;
  customerId: string;
  customer: Customer;
  parentMemberId: string;
  parentMember: Member;

  walletId: string;
  wallet: Wallet;
}
export class MemberRepository extends CrudRepository<Member> {
  apiName: string = "Member";
  displayName: string = "cửa hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    username: String
    uid: String
    name: String
    avatar: String
    phone: String
    fanpageId: String
    fanpageName: String
    fanpageImage: String
    shopName: String
    shopLogo: String
    shopType:String
    activated: Boolean
    phoneVerified: Boolean
    categoryId: string
    category { id name }
    subscription {
      ${ShopSubscriptionService.shortFragment}
    }
    threadId: ID
    customerId: ID
    customerId: string;
    customer{
      id: String 
      name: String
    }: Customer;
    parentMemberId: ID
    parentMember{
      id: String 
      name: String
    }: Member
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    username: String
    uid: String
    name: String
    avatar: String
    phone: String
    fanpageId: String
    fanpageName: String
    fanpageImage: String
    shopName: String
    shopLogo: String
    shopCover: String
    cumulativePoint: Float
    diligencePoint: Float
    commission: Float
    address: String
    provinceId: String
    districtId: String
    wardId: String
    province: String
    district: String
    ward: String
    identityCardNumber: String
    gender: String
    birthday: DateTime
    parentIds: [ID]
    activedAt: DateTime
    activated: Boolean
    type: String
    branchId: ID
    positionId: ID
    phoneVerified: Boolean
    psids: [String]
    allowSale: Boolean
    shopType:String
    shopUrl: String
    ordersCount: Int
    toMemberOrdersCount: Int
    deliveryDistricts: [String]
    categoryId: string
    category { id name }: ShopCategory
    subscription {
      ${ShopSubscriptionService.fullFragment}
    }
    threadId: ID
    customerId: string;
    customer{
      id: String 
      name: String
    }: Customer;
    parentMemberId: ID
    parentMember{
      id: String 
      name: String
    }: Member
    thread { id }
    wallet { id balance }
  `);
  async verifyMemberPhoneByFirebaseToken(idToken: string) {
    return await this.apollo.mutate({
      mutation: this.gql`
        mutation {
          verifyMemberPhoneByFirebaseToken(token: "${idToken}") {
            ${this.fullFragment}
          }
        }
      `,
    });
  }
  async updateMemberPassword(id: string, password: string) {
    return await this.apollo.mutate({
      mutation: this.gql`
        mutation {
          updateMemberPassword(memberId: "${id}", password: "${password}") {
            id
          }
        }
      `,
    });
  }

  async getMemberToken(memberId: string, token?: string) {
    return await this.query({
      query: `getMemberToken(memberId: "${memberId}")`,
      token,
    }).then((res) => res.data.g0);
  }

  async getAListOfStoresByProvince() {
    return await this.query({
      query: `getAListOfStoresByProvince`,
    }).then((res) => res.data.g0 as StoreProvince[]);
  }
  async sendOTP(emailOTP: string) {
    return await this.mutate({
      mutation: `sendOTP(emailOTP: "${emailOTP}")`,
    }).then((res) => res.data.g0);
  }

  async resetMemberPassword(emailOTP: string, OTP: string, newPassword: string) {
    return await this.mutate({
      mutation: `resetMemberPassword(emailOTP: "${emailOTP}", OTP: "${OTP}", newPassword: "${newPassword}")`,
    }).then((res) => res.data.g0);
  }
}

export const MemberService = new MemberRepository();

export const SHOP_TYPE_LIST: Option<ShopType>[] = [
  { value: "ENTERPRISE", label: "Doanh nghiệp", color: "warning" },
  { value: "SALE_POINT", label: "Điểm bán", color: "teal" },
];
