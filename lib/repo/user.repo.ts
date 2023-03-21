import { BaseModel, CrudRepository } from "./crud.repo";

export interface User extends BaseModel {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatar: string;
  province: string;
  district: string;
  ward: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  role: "ADMIN" | "EDITOR";
  unseenNotify: number;
  psid: string;
  subscriber: SubscriberInfo;
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
export class UserRepository extends CrudRepository<User> {
  apiName: string = "User";
  displayName: string = "tài khoản";
  shortFragment: string = this.parseFragment(`
    id: String
    uid: string
    email: string
    name: string
    phone: string
    wardId: string
    role: 'ADMIN' | 'EDITOR'
    createdAt: DateTime
    updatedAt: DateTime
    avatar
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    uid: string
    email: string
    name: string
    phone: string
    wardId: string
    role: 'ADMIN' | 'EDITOR'
    createdAt: DateTime
    updatedAt: DateTime
    avatar
  `);

  // for firebase
  async login(token): Promise<{ user: User; token: string }> {
    return await this.apollo
      .mutate({
        mutation: this
          .gql`mutation {  login(idToken: "${token}") { user { ${this.fullFragment} } token }}`,
      })
      .then((res) => res.data["login"]);
  }

  // fore server username
  async userGetMe() {
    return await this.apollo
      .query({
        query: this.gql`query {  userGetMe { ${this.fullFragment} }}`,
      })
      .then((res) => res.data["userGetMe"] as User);
  }

  // for firebase

  async updateUserPassword(id: string, password: string) {
    return await this.apollo.mutate({
      mutation: this.gql`
        mutation {
          updateUserPassword(id: "${id}", password: "${password}") {
            id
          }
        }
      `,
    });
  }

  async loginWithUsernamePassword(username: string, password: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`
        mutation {
            loginWithUsernamePassowrd(
                username: "${username}",
                password: "${password}"
            ) {
                user { ${this.fullFragment} }
                token
            }
        }
      `,
      })
      .then((res) => ({
        user: res.data["loginWithUsernamePassowrd"]["user"] as User,
        token: res.data["loginWithUsernamePassowrd"]["token"] as string,
      }));
  }

  async activeUser(userId: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation { activeUser(userId: "${userId}") { ${this.fullFragment}}}`,
      })
      .then((res) => res.data["activeUser"] as User);
  }

  async blockUser(userId: string) {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation { blockUser(userId: "${userId}") { ${this.fullFragment}}}`,
      })
      .then((res) => res.data["blockUser"] as User);
  }

  async userUpdateMe(data: any) {
    return this.mutate({
      mutation: `userUpdateMe(data: $data) { ${this.fullFragment} }`,
      variablesParams: `($data: UserUpdateMeInput!)`,
      options: {
        variables: { data },
      },
    }).then((res) => res.data.g0);
  }

  async updateWriterPassword(password: string, oldPassword: string) {
    return this.mutate({
      mutation: `updateWriterPassword(password: "${password}", oldPassword: "${oldPassword}" )`,
    }).then((res) => res.data.g0);
  }

  async updateWriterPasswordByAdmin(writerId: string, newPassword: string) {
    return this.mutate({
      mutation: `updateWriterPasswordByAdmin(writerId: "${writerId}", newPassword: "${newPassword}" )`,
    }).then((res) => res.data.g0);
  }
}

export const UserService = new UserRepository();

export const USER_ROLES: Option[] = [
  { value: "ADMIN", label: "Quản trị", color: "primary" },
  // { value: "USER", label: "Biên tập viên", color: "success" },
];
