import { Place, PlaceService } from "../place.repo";
import { QuestionCommentService } from "../question/question-comment.repo";
import { QuestionService } from "../question/question.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { QuestionComment } from "../question/question-comment.repo";
import { Question } from "../question/question.repo";
import { GlobalCustomer, GlobalCustomerService } from "./global-customer.repo";

export interface GlobalCustomerCheckPhoneExist extends BaseModel {
  isDupplicate: boolean;
}
export class GlobalCustomerCheckPhoneExistRepository extends CrudRepository<
  GlobalCustomerCheckPhoneExist
> {
  apiName: string = "GlobalCustomerCheckPhoneExist";
  displayName: string = "kiểm tra số điện thoại";
  shortFragment: string = this.parseFragment(`
 
`);
  fullFragment: string = this.parseFragment(`
  isDupplicate: Boolean
  `);


  async globalCustomerIsPhoneExist(phone: string, regionCode: string) {
    return await this.query({
      query: `globalCustomerIsPhoneExist(phone: "${phone}", regionCode: "${regionCode}") {
        ${GlobalCustomerCheckPhoneExistService.fullFragment}
      }`,
    }).then((res) => res.data["g0"] );
  }
}

export const GlobalCustomerCheckPhoneExistService = new GlobalCustomerCheckPhoneExistRepository();
