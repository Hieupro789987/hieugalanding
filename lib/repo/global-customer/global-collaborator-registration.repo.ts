import { GetGlobalCustomerToken } from "../../graphql/auth.link";
import { BaseModel, CrudRepository } from "../crud.repo";
import { User } from "../user.repo";
import { GlobalCustomer } from "./global-customer.repo";

export interface GlobalCollaboratorRegistration extends BaseModel {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  code?: string;
  customerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectReason?: string;
  updateByUserId?: string;
  status?: RegisterStatus;
  identityNumber?: string;
  updateBy?: User;
  customer?: GlobalCustomer;
  referralCode: string;
  referralGlobalCustomerId: string;
}
export class GlobalCollaboratorRegistrationRepository extends CrudRepository<
  GlobalCollaboratorRegistration
> {
  apiName: string = "GlobalCollaboratorRegistration";
  displayName: string = "Đăng ký cộng tác viên";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    customerId: ID
    name: String
    phone: String
    email: String
    approvedAt: DateTime
    rejectedAt: DateTime
    rejectReason: String
    updateByUserId: ID
    referralCode: String
    referralGlobalCustomerId: ID
    status: String
    identityNumber: String!
    updateBy {
      id :String
    }
    customer{
      id:Sting
      name:String
      phone:String
      email:String
    }
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    customerId: ID
    name: String
    phone: String
    email: String
    approvedAt: DateTime
    rejectedAt: DateTime
    rejectReason: String
    updateByUserId: ID
    status: String
    identityNumber: String!
    referralCode: String
    referralGlobalCustomerId: ID
    updateBy {
      id: String
      name: String
    }
    customer {
      id: String
      code: String
      name: String
      phone: String
      email: String
      avatar: String
      momoWallet {
        status: String
      }: CustomerMomoWallet
      collaboratorRegis{
        status: Boolean
        referralCode: String
      }
      refLink: String
    }
  `);

  async createGlobalCollaboratorRegistration(data) {
    return await this.mutate({
      mutation: `
      createGlobalCollaboratorRegistration(data:$data) {
          ${this.shortFragment}
        }
      `,
      token: GetGlobalCustomerToken(),
      variablesParams: `($data: CreateGlobalCollaboratorRegistrationInput!)`,
      options: {
        variables: { data },
      },
    });
  }

  async updateGlobalCollRegistStatus(
    registId: string,
    status: string,
    rejectReason?: string
  ): Promise<GlobalCollaboratorRegistration> {
    return await this.mutate({
      mutation: `updateGlobalCollRegistStatus(registId: "${registId}", status: "${status}", rejectReason: "${rejectReason}") {
          ${this.fullFragment}
        }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }
}

export const GlobalCollaboratorRegistrationService = new GlobalCollaboratorRegistrationRepository();

export type RegisterStatus = "PENDING" | "APPROVED" | "REJECTED";
export const REGISTER_STATUS_LIST: Option<RegisterStatus>[] = [
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "APPROVED", label: "Đã chấp nhận", color: "success" },
  { value: "REJECTED", label: "Đã từ chối", color: "danger" },
];
