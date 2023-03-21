import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { ShopComment, ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import { useProductDetailsContext } from "../../../shared/product-details/product-details-provider";
import { Button } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { FeedbackItem, STAR_FEEDBACK } from "../../product-detail/components/product-feedback";

type Props = {};

export function StoreDetailFeedback({}: Props) {
  const [comments, setComments] = useState<ShopComment[]>();
  const [rating, setRating] = useState("0");
  const { items } = useCrud(ShopCommentService, {
    limit: 10,
    filter: { status: "PUBLIC" },
    order: { createdAt: -1 },
  });

  useEffect(() => {
    ShopCommentService.getAll({
      query: {
        filter: { status: "PUBLIC", rating: rating ? rating : null },
        order: { createdAt: -1 },
      },
    }).then((res) => setComments(res.data));
  }, [rating]);

  return (
    <div className="p-5 bg-white" id="comments">
      <div className="text-2xl font-semibold text-accent mb-7">Đánh giá</div>
      <div className="flex flex-row items-center">
        {STAR_FEEDBACK.map((item, index) => (
          <Button
            key={index}
            text={item.label}
            className={`${
              rating == item.value ? "bg-primary-light text-primary" : "text-gray-400"
            }"h-12 mr-3 border"`}
            outline
            icon={index == 0 ? <></> : <AiFillStar className="text-yellow-400 text-xl" />}
            onClick={() => setRating(item.value)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        {!items ? (
          <Spinner />
        ) : items?.length > 0 ? (
          rating == "0" ? (
            items.map((item, index) => <FeedbackItem key={index} feedback={item} />)
          ) : comments?.length > 0 ? (
            comments.map((item, index) => <FeedbackItem key={index} feedback={item} />)
          ) : (
            <NotFound text="Chưa có đánh giá nào" />
          )
        ) : (
          <NotFound text="Chưa có đánh giá nào" />
        )}
      </div>
    </div>
  );
}
