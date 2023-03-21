import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export function ShowRating({
  rating,
  className = "",
  ...props
}: ReactProps & { rating: number | string }) {
  const showRating = (rating) => {
    var result = [];
    for (let i = 1; i <= rating; i++) {
      result.push(
        <span className="mr-1" key={i}>
          <AiFillStar className="text-yellow-400 text-lg" />
        </span>
      );
    }
    for (let j = 1; j <= 5 - rating; j++) {
      result.push(
        <span className="mr-1" key={Math.random() * j + j}>
          <AiOutlineStar className="text-gray-400 text-lg" />
        </span>
      );
    }
    return result;
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>{showRating(rating)}</div>
  );
}
