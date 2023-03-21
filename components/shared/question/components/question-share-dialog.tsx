import { useCopy } from "../../../../lib/hooks/useCopy";
import { CloseButtonHeaderDialog } from "../../dialog/close-button-header-dialog";
import { TitleDialog } from "../../dialog/title-dialog";
import { Dialog, DialogProps } from "../../utilities/dialog";
import { Button } from "../../utilities/form";
import { Img } from "../../utilities/misc";
import { DEFAULT_LOGO_IMAGE } from "../commons/commons";

export function QuestionShareDialog({ question, ...props }: DialogProps & { question: any }) {
  const copy = useCopy();
  const link = window.location?.origin + "/questions/" + question?.slug;

  return (
    <Dialog {...props} width={"420px"}>
      <Dialog.Body>
        <CloseButtonHeaderDialog onClose={props.onClose} />
        <TitleDialog
          title="Chia sẻ câu hỏi"
          subtitle="Vui lòng nhấn Sao chép link để chia sẻ câu hỏi"
        />
        <div className="mt-4 border rounded">
          <Img
            src={question?.images[0] || DEFAULT_LOGO_IMAGE}
            alt="question-image-dialog"
            className="w-full rounded-t"
            ratio169
          />
          <div className="p-4 overflow-hidden">
            <div className="text-sm font-medium text-ellipsis-3">{question?.title}</div>
          </div>
        </div>
        <hr className="my-4" />
        <input
          readOnly
          className="w-full px-3 py-3 border border-gray-100 rounded bg-primary-light text-ellipsis"
          value={link}
        />
        <Button
          primary
          className="w-full h-12 mt-4 mb-2 shadow-lg shadow-green-700/50"
          text="Sao chép link"
          onClick={() => copy(link)}
        />
      </Dialog.Body>
    </Dialog>
  );
}
