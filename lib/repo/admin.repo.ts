import { BaseModel, CrudRepository } from "./crud.repo";

export interface Admin extends BaseModel {
  name: string;
  email: string;
  avatar: string;
  address: string;
}
export class AdminRepository extends CrudRepository<Admin> {
  apiName: string = "Admin";
  displayName: string = "quản trị";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    internationalPhone: String
    name: String
    email: String
    avatar: String
    address: String
    userId: String
    user{
      id phone
    }: User
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    internationalPhone: String
    name: String
    email: String
    avatar: String
    address: String
    userId: String
    user{
      id phone
    }: User
  `);

  async updateAdminSelf(adminId: string, data: any) {
    return await this.mutate({
      mutation: `updateAdminSelf(adminId: $adminId, data: $data) {
        ${AdminService.fullFragment}
      }`,
      variablesParams: `($adminId: ID!
        $data: UpdateAdminSelfInput!)`,
      options: {
        variables: {
          adminId,
          data,
        },
      },
    }).then((res) => res.data["g0"]);
  }
}

export const AdminService = new AdminRepository();
