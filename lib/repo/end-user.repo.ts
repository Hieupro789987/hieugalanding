import { BaseModel, CrudRepository } from "./crud.repo";

export interface EndUser extends BaseModel {
  internationalPhone: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  gender: string;
  birthday: string;
  type: string;
  companyName: string;
  companyTaxNumber: string;
  companyHotline: string;
  companyAddress: string;
}
export interface UpdateEndUserSelfInput {
  name?: string;
  email?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  type?: string;
  companyName?: string;
  companyTaxNumber?: string;
  companyHotline?: string;
  companyAddress?: string;
}

export class EndUserRepository extends CrudRepository<EndUser> {
  apiName: string = "EndUser";
  displayName: string = "khách hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    userId: String
    internationalPhone: String
    name: String!
    email: String
    avatar: String
    gender: String
    birthday: DateTime
    type: String
    companyName: String
    companyTaxNumber: String
    companyHotline: String
    companyAddress: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    userId: String
    internationalPhone: String
    name: String!
    email: String
    avatar: String
    gender: String
    birthday: DateTime
    type: String
    companyName: String
    companyTaxNumber: String
    companyHotline: String
    companyAddress: String
  `);

  async updateEndUserSelf(endUserId: string, data: any): Promise<EndUser> {
    return this.mutate({
      mutation: `updateEndUserSelf(endUserId: $endUserId,data: $data) {
        ${EndUserService.fullFragment}
      }`,
      variablesParams: `($endUserId: ID!
        $data: UpdateEndUserSelfInput!)`,
      options: {
        variables: {
          endUserId,
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async resetPasswordByFirebaseToken(idToken: string, newPassword: string) {
    return await this.mutate({
      mutation: `resetPasswordByFirebaseToken(idToken: $idToken, newPassword: $newPassword)`,
      variablesParams: `($idToken: String!
        $newPassword: String!)`,
      options: {
        variables: {
          idToken,
          newPassword,
        },
      },
    }).then((res) => res.data["g0"]);
  }
}
export const EndUserService = new EndUserRepository();
