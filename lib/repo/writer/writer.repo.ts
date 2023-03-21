import { BaseModel, CrudRepository } from "../crud.repo";
import { Place, PlaceService } from "../place.repo";
import { WriterGroup, WriterGroupService } from "./writer-group.repo";

export interface Writer extends BaseModel {
  internationalPhone: string;
  email: string;
  name: string;
  avatar: string;
  phone: string;
  address: Place;
  groupId: string;
  group: WriterGroup;
}
export class WriterRepository extends CrudRepository<Writer> {
  apiName: string = "Writer";
  displayName: string = "Người đăng tin";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    internationalPhone: String
    email: String
    name: String
    avatar: String
    phone: String
    groupId: ID
    group {id name}
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    internationalPhone: String
    email: String
    name: String
    avatar: String
    phone: String
    address{
      ${PlaceService.fullFragment}
    }: Place
    groupId: ID
    group {
      ${WriterGroupService.fullFragment}
    }
  `);

  async resetWriterPasswordByEmailSendLink(
    email: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetWriterPasswordByEmailSendLink(email: "${email}") { valid message }}`,
      })
      .then((res) => res.data.resetWriterPasswordByEmailSendLink.valid);
  }

  async resetWriterPasswordByEmailCheckLink(
    code: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetWriterPasswordByEmailCheckLink(resetPasswordLink: "${code}") { valid message }}`,
      })
      .then((res) => res.data.resetWriterPasswordByEmailCheckLink.valid);
  }

  async resetWriterPasswordByEmail(
    code: string,
    newPassword: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetWriterPasswordByEmail(resetPasswordLink: "${code}", newPassword: "${newPassword}") { valid message }}`,
      })
      .then((res) => res.data.resetWriterPasswordByEmail.valid);
  }

  // async exportExcelAdmin(fromDate: string, toDate: string, memberId) {
  //   return axios
  //     .get("/api/reportAdmin/exportCollaborator", {
  //       params: {
  //         fromDate,
  //         toDate,
  //         memberId,
  //       },
  //       headers: {
  //         "x-token": GetUserToken(),
  //       },
  //       responseType: "blob",
  //     })
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       throw err.response.data;
  //     });
  // }

  async updateWriterSelf(writerId: string, data: any): Promise<Writer> {
    return this.mutate({
      mutation: `updateWriterSelf(writerId: $writerId, data: $data) {
        ${WriterService.fullFragment}
      }`,
      variablesParams: `($writerId: ID!
        $data: UpdateWriterSelfInput!)`,
      options: {
        variables: {
          writerId,
          data,
        },
      },
    }).then((res) => res.data.g0);
  }
  async updateWriterPassword(password: string, oldPassword: string): Promise<string> {
    return this.mutate({
      mutation: `updateWriterPassword(password: $password,oldPassword: $oldPassword )`,
      variablesParams: `($password: String!
      $oldPassword: String!)`,
      options: {
        variables: {
          password,
          oldPassword,
        },
      },
    }).then((res) => res.data.g0);
  }
  async writerUpdatePhoneNumber(idToken: string) {
    return await this.mutate({
      mutation: `
      writerUpdatePhoneNumber(idToken: "${idToken}") `,
    }).then((res) => res.data.g0);
  }
}

export const WriterService = new WriterRepository();
