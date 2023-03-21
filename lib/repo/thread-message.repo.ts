import { User } from "react-email-editor";
import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { Member } from "./member.repo";
import { ThreadRole } from "./thread.repo";

export interface ThreadSender {
  role?: ThreadRole; // Loại người dùng
  userId?: string; // Mã quản lý
  memberId?: string; // Mã cửa hàng
  customerId?: string; // Mã khách hàng
  user?: User;
  member?: Member;
  customer?: Customer;
}

export interface ThreadMessage extends BaseModel {
  threadId?: string; // Mã cuộc trao đổi
  type?: string; // Loại tin nhắn
  text?: string; // Tin nhắn
  attachment?: any; // Dữ liệu đính kèm
  sender?: ThreadSender; // Người gửi
  seen?: boolean; // Đã xem
  seenAt?: Date; // Ngày xem
}
export class ThreadMessageRepository extends CrudRepository<ThreadMessage> {
  apiName: string = "ThreadMessage";
  displayName: string = "Tin nhắn";
  shortFragment: string = this.parseFragment(`
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    threadId: ID
    type: String
    text: String
    attachment: Mixed
    sender { 
      role
      user { id name }
      member { id code shopName }
      customer { id name }
    }
    seen: Boolean
    seenAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    threadId: ID
    type: String
    text: String
    attachment: Mixed
    sender { 
      role
      user { id name }
      member { id code shopName }
      customer { id name }
    }
    seen: Boolean
    seenAt: DateTime
  `);
}

export const ThreadMessageService = new ThreadMessageRepository();
