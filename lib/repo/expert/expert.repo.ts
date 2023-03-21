import { BaseModel, CrudRepository } from "../crud.repo";
import { Disease, DiseaseService } from "../disease.repo";
import { Place, PlaceService } from "../place.repo";
import { Plant, PlantService } from "../plant.repo";
import { ExpertGroup, ExpertGroupService } from "./expert-group.repo";

export interface Expert extends BaseModel {
  isDeleted: boolean;
  deletedAt: string;
  internationalPhone: string;
  name: string;
  email: string;
  avatar: string;
  address: Place;
  specializes: string;
  specializesInPlantIds: string[];
  specializesInPlants: Plant[];
  specializesInDiseaseIds: string[];
  specializesInDiseases: Disease[];
  expertGroupId: string;
  expertGroup: ExpertGroup;
}

export class ExpertRepository extends CrudRepository<Expert> {
  apiName: string = "Expert";
  displayName: string = "Chuyên gia";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isDeleted: Boolean
    deletedAt: DateTime
    internationalPhone: String
    name: String
    email: String
    avatar: String
    expertGroupId: String
    expertGroup{
      id name
    }: ExpertGroup;
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isDeleted: Boolean
    deletedAt: DateTime
    internationalPhone: String
    name: String
    email: String
    avatar: String
    specializes: String
    specializesInPlantIds: [String]
    specializesInPlants{
      ${PlantService.fullFragment}
    }: [Plant]
    specializesInDiseaseIds: [String]
    specializesInDiseases{
      ${DiseaseService.fullFragment}
    }: [Disease]
    expertGroupId: String
    expertGroup{
      ${ExpertGroupService.fullFragment}
    }: ExpertGroup;
    address{
      ${PlaceService.fullFragment}
    }:Place
  `);

  async updateExpertSelf(data: any): Promise<Expert> {
    return this.mutate({
      mutation: `updateExpertSelf(data: $data) {
        ${this.fullFragment}
      }`,
      variablesParams: `($data: UpdateExpertSelfInput!)`,
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data.g0);
  }
  async updateExpertPassword(password: string, oldPassword: string): Promise<string> {
    return this.mutate({
      mutation: `updateExpertPassword(password: $password,oldPassword: $oldPassword )`,
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

  // expertUpdatePhoneNumber
  async expertUpdatePhoneNumber(idToken: string) {
    return await this.mutate({
      mutation: `
      expertUpdatePhoneNumber(idToken: "${idToken}") `,
    }).then((res) => res.data.g0);
  }

  async resetExpertPasswordByEmailSendLink(
    email: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetExpertPasswordByEmailSendLink(email: "${email}") { valid message }}`,
      })
      .then((res) => res.data.resetExpertPasswordByEmailSendLink?.valid);
  }

  async resetExpertPasswordByEmailCheckLink(
    code: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetExpertPasswordByEmailCheckLink(resetPasswordLink: "${code}") { valid message }}`,
      })
      .then((res) => res.data.resetExpertPasswordByEmailCheckLink?.valid);
  }

  async resetExpertPasswordByEmail(
    code: string,
    newPassword: string
  ): Promise<{ valid: Boolean; message: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  resetExpertPasswordByEmail(resetPasswordLink: "${code}", newPassword: "${newPassword}") { valid message }}`,
      })
      .then((res) => res.data.resetExpertPasswordByEmail?.valid);
  }


}

export const ExpertService = new ExpertRepository();
