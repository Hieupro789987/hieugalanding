import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { RiTimeLine } from "react-icons/ri";
import { formatDate } from "../../../lib/helpers/parser";
import { Post, PostService } from "../../../lib/repo/post.repo";
import { Button } from "../../shared/utilities/form";
import { NotFound, Spinner } from "../../shared/utilities/misc";

export function TemsOfServicePage({ id, ...props }: ReactProps & { id: string }) {
  const [post, setPost] = useState<Post>(undefined);
  useEffect(() => {
    if (!id) return;
    PostService.getOne({ id })
      .then((res) => setPost(cloneDeep(res)))
      .catch((err) => {
        setPost(null);
      });
  }, [id]);
  if (post === undefined) return <Spinner />;
  if (post === null) return <NotFound text="Không tìm thấy điều khoản dịch vụ" />;
  return (
    <div className="bg-gray-200">
      <div className="max-w-screen-md p-4 mx-auto bg-white border border-gray-100 shadow sm:p-6">
        <div className="flex text-sm text-center text-gray-500">
          <i className="text-base mt-0.5">
            <RiTimeLine />
          </i>
          <span className="ml-1">{formatDate(post.createdAt, "HH:mm dd/MM/yyyy")}</span>
        </div>
        <div
          className="ck-content"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        ></div>
        <Button text="Quay lại trang chủ" textPrimary outline className="my-4 " href="/" />
      </div>
    </div>
  );
}
