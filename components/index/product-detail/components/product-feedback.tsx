import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { formatDate } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { ShopComment, ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import { ShowRating } from "../../../shared/common/show-rating";
import { Button } from "../../../shared/utilities/form";
import { Img, NotFound, Spinner } from "../../../shared/utilities/misc";

type Props = {};

export function ProductFeedback({}: Props) {
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
    <div className="w-full p-5 my-8 bg-white" id="product-comments">
      <div className="font-semibold text-accent text-[28px] mb-7">Đánh giá</div>
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

export function FeedbackItem({ feedback, ...props }) {
  return (
    <div className="my-4">
      <div className="flex flex-row items-center">
        <Img className="object-cover rounded-full w-14" src="/assets/default/avatar.png" />
        <div className="ml-4">
          <div className="font-semibold capitalize text-accent">{feedback?.ownerName}</div>
          <div className="flex flex-row items-center">
            {<ShowRating rating={feedback?.rating} />}
          </div>
        </div>
      </div>
      <div className="my-4 text-accent">{feedback?.message}</div>
      <div className="flex flex-row items-center mb-2">
        {feedback?.images.length > 0
          ? feedback?.images.map((item, index) => (
              <Img
                src={item}
                key={index}
                className="object-cover w-12 mr-3 rounded-md"
                showImageOnClick
              />
            ))
          : null}
      </div>
      <div className="text-gray-400 text-xs">
        {formatDate(`${feedback?.updatedAt}`, "dd-MM-yyyy")}
      </div>
    </div>
  );
}

export const STAR_FEEDBACK: Option[] = [
  {
    value: "0",
    label: "Tất cả đánh giá",
  },
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
  {
    value: "4",
    label: "4",
  },
  {
    value: "5",
    label: "5",
  },
];
