import { Button } from "../../utilities/form";

export function QuestionNotFoundPage({ ...props }) {
  return (
    <div className="flex-1 pt-14 pb-20 text-accent bg-white">
      <div className={`main-container flex-cols flex-center`}>
        <img
          alt="question-details-not-found-image"
          className=""
          src="https://i.imgur.com/su0XHxY.png"
        />
        <div className="font-bold text-accent mt-8 mb-6">Câu hỏi không tồn tại hoặc đã bị xóa</div>
        <Button
          primary
          text="Trở về trang hỏi đáp"
          className="h-14 shadow-lg shadow-green-700/50"
          href="/questions"
        />
      </div>
    </div>
  );
}
