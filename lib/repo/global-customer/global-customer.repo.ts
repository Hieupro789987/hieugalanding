import { GetGlobalCustomerToken } from "../../graphql/auth.link";
import { BaseModel, CrudRepository } from "../crud.repo";
import { Customer, CustomerService } from "../customer.repo";
import { GlobalCollaboratorRegistration } from "./global-collaborator-registration.repo";
import { Owner } from "../types/mixed.type";
import { Place } from "../place.repo";
import { CustomerMomoWallet } from "../../../../src/graphql/modules/customer/momoWallet/customerMomoWallet.graphql";

export interface GlobalCustomer extends BaseModel {
  code: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  gender: string;
  birthday: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isCTV: Boolean;
  refId: string;
  isCTVAt: string;
  commissionWalletId: string;
  referralGlobalCustomerId: string;
  commissionWallet: Wallet;
  customerIds: string[];
  hasPassword: Boolean;
  type: string;
  companyName: string;
  companyTaxNumber: string;
  companyHotline: string;
  companyAddress: String;
  refLink: string;
  collaboratorRegis: GlobalCollaboratorRegistration;
  momoWallet: CustomerMomoWallet;
}
export interface Wallet extends BaseModel {
  type: string;
  balance: string;
  owner: Owner;
}
export class GlobalCustomerRepository extends CrudRepository<GlobalCustomer> {
  apiName: string = "GlobalCustomer";
  displayName: string = "khách hàng hệ thống";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    phone: String
    email: String
    avatar: String
    gender: String
    birthday: DateTime
    fullAddress: String
    latitude: Float
    longitude: Float
    isCTV: Boolean
    refId: String
    isCTVAt: DateTime
    commissionWalletId: ID
    referralGlobalCustomerId: ID
    commissionWallet{
      id balance
    }: Wallet
    customerIds: [String]
    hasPassword: Boolean
    type: String
    companyName: String
    companyTaxNumber: String
    companyHotline: String
    companyAddress: String
    refLink: String
    collaboratorRegis{ id status }: GlobalCollaboratorRegistration
    momoWallet {
      status: String
      statusMsg: String
      phone: String
      idCard: String
      name: String
      submitAt: DateTime
      updateAt: DateTime
    }: CustomerMomoWallet
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    phone: String
    email: String
    avatar: String
    gender: String
    birthday: DateTime
    fullAddress: String
    latitude: Float
    longitude: Float
    isCTV: Boolean
    refId: String
    isCTVAt: DateTime
    commissionWalletId: ID
    referralGlobalCustomerId: ID
    commissionWallet{
      id balance
    }: Wallet
    customerIds: [String]
    hasPassword: Boolean
    type: String
    companyName: String
    companyTaxNumber: String
    companyHotline: String
    companyAddress: String
    refLink: String
    collaboratorRegis{ id status }: GlobalCollaboratorRegistration
    momoWallet {
      status: String
      statusMsg: String
      phone: String
      idCard: String
      name: String
      submitAt: DateTime
      updateAt: DateTime
    }: CustomerMomoWallet
  `);

  async getCustomerToken(shopCode: string) {
    return await this.query({
      query: `
        getCustomerToken(shopCode: "${shopCode}") {
          customer { ${CustomerService.fullFragment} } token
        }
      `,
      token: GetGlobalCustomerToken(),
    }).then((res) => res.data.g0 as { customer: Customer; token: string });
  }

  async updatePasswordGlobalCustomer(password: string, oldPassword: string) {
    return await this.mutate({
      mutation: `
        updatePasswordGlobalCustomer(password: "${password}", oldPassword: "${oldPassword}")
      `,
      token: GetGlobalCustomerToken(),
    }).then((res) => res.data.g0 as string);
  }

  async globalCustomerUpdateMe(data: any) {
    return await this.mutate({
      mutation: `globalCustomerUpdateMe(data: $data) { ${this.fullFragment} }`,
      variablesParams: `($data: UpdateGlobalCustomerInput!)`,
      token: GetGlobalCustomerToken(),
      options: {
        variables: { data },
      },
    }).then((res) => res.data.g0);
  }

  setRefId(refId) {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    localStorage.setItem(
      "refId",
      JSON.stringify({
        refId: refId,
        // set expired time after 7 days
        expiredAt: date.toISOString(),
      })
    );
  }

  removeRefId() {
    localStorage.removeItem("refId");
  }

  getRefId() {
    const isServer = typeof window === "undefined";
    if (!isServer) {
      const refId = localStorage.getItem("refId");
      if (refId) {
        const { refId: _refId, expiredAt } = JSON.parse(refId);
        if (new Date(expiredAt) > new Date()) {
          return _refId;
        } else {
          this.removeRefId();
          return null;
        }
      }
      return null;
    }
    return;
  }

  async submitCustomerMomoWallet({ name, idCard }) {
    return await this.mutate({
      mutation: `submitCustomerMomoWallet(name: "${name}", idCard: "${idCard}")`,
    }).then((res) => res.data["g0"]);
  }

  async changePassNotRequireOldPass(idToken, newPassword) {
    return await this.mutate({
      mutation: `resetPasswordGlobalCustomerByFirebaseToken(idToken: "${idToken}", newPassword: "${newPassword}")`,
    }).then((res) => res.data["g0"]);
  }

  async getGlobalCustomer() {
    return await this.query({
      query: `globalCustomerGetMe { ${this.fullFragment} }`,
      options: {
        fetchPolicy: "no-cache",
      },
    }).then((res) => res.data["g0"] as Customer);
  }
}

export const GlobalCustomerService = new GlobalCustomerRepository();
