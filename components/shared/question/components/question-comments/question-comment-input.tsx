import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { RiAddLine, RiCloseLine, RiImageAddLine, RiMedicineBottleLine } from "react-icons/ri";
import { uploadImage } from "../../../../../lib/helpers/image";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Prescription } from "../../../../../lib/repo/prescription.repo";
import { Product } from "../../../../../lib/repo/product.repo";
import {
  QuestionComment,
  QuestionCommentService,
} from "../../../../../lib/repo/question/question-comment.repo";
import { Button, Form } from "../../../utilities/form";
import { Img, Spinner } from "../../../utilities/misc";
import { useQuestionCommentsContext } from "../../providers/question-comments-provider";
import { QuestionPrescription } from "../question-prescription/question-prescription";
import { QuestionPrescriptionDialog } from "../question-prescription/question-prescription-dialog";
import { QuestionSuggestProducts } from "../question-suggest-products/question-suggest-products";
import { QuestionSuggestProductsDialog } from "../question-suggest-products/question-suggest-products-dialog";

export function QuestionCommentInput({
  globalCustomerId,
  questionId,
  comment,
  isDetails,
  editCommentId,
  onEditCommentIdChange,
  onTotalCommentsChange,
  onOpenRequestDialog,
  ...props
}: {
  globalCustomerId: string;
  questionId: string;
  isDetails?: boolean;
  editCommentId?: string;
  comment?: QuestionComment;
  onEditCommentIdChange?: (val: string) => void;
  onTotalCommentsChange?: (total: number) => void;
  onOpenRequestDialog?: () => void;
} & ReactProps) {
  const toast = useToast();
  const {
    displayQuestionCommentList,
    questionCommentListCrud,
    expertId,
  } = useQuestionCommentsContext();
  const imgRef = useRef(null);
  const commentTextareaRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [image, setImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [openSuggestedProductsDialog, setOpenSuggestedProductsDialog] = useState(false);
  const [suggestedProductIdList, setSuggestedProductIdList] = useState<string[]>([]);
  const [suggestedProductList, setSuggestedProductList] = useState<Product[]>([]);
  const [openPrescriptionsDialog, setOpenPrescriptionsDialog] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [editPrescription, setEditPrescription] = useState<Prescription>();
  const [indexPrescription, setIndexPrescription] = useState<number>();

  const emptyContent =
    content.trim().length === 0 &&
    !image &&
    suggestedProductIdList.length === 0 &&
    prescriptions.length === 0;

  //Begin: old new Authentication code

  const userTypeSubmit = useMemo(() => {
    if (!!expertId) return "expert";

    return "globalCustomer";
  }, [location.pathname]);

  //End: old new Authentication code

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      let files = e.target.files;
      if (files.length === 0) return;

      setUploading(true);
      const res = await uploadImage(files[0]);
      setImage(res.link);
    } catch (error) {
      console.debug(error);
      toast.error("Upload ảnh thất bại!", `${error.message}`);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const handleSubmit = async (userType: "globalCustomer" | "expert" = "globalCustomer") => {
    if (emptyContent) {
      commentTextareaRef.current.focus();
      setError(true);
      return;
    }

    //Begin: old authentication code
    try {
      let data = {
        questionId,
        content,
        image,
        prescriptions,
        suggestedProductIds: suggestedProductIdList,
      };

      if (editCommentId) {
        delete data["questionId"];
      }

      if (userType === "globalCustomer") {
        delete data["prescriptions"];
        delete data["suggestedProductIds"];
      }

      let newQuestionComment: QuestionComment;

      newQuestionComment = await QuestionCommentService.createOrUpdate({
        id: comment?.id,
        data,
      });

      const newDisplayQuestionCommentList = [...displayQuestionCommentList];

      if (editCommentId) {
        const index = newDisplayQuestionCommentList.findIndex(
          (cmt) => cmt.id === newQuestionComment.id
        );

        if (index >= 0) {
          newDisplayQuestionCommentList[index] = newQuestionComment;
        }
      } else {
        newDisplayQuestionCommentList.push(newQuestionComment);
        const total = questionCommentListCrud.pagination.total + 1;
        questionCommentListCrud.setPagination({
          ...questionCommentListCrud.pagination,
          total,
        });
        onTotalCommentsChange(total);
      }
      questionCommentListCrud.setItems(newDisplayQuestionCommentList);

      setContent("");
      setImage("");
      setSuggestedProductIdList([]);
      setSuggestedProductList([]);
      setPrescriptions([]);
      setError(false);
      if (editCommentId) {
        onEditCommentIdChange?.(undefined);
      }
    } catch (error) {
      console.debug(error);
      toast.error("Bình luận thất bại!", `${error.message}`);
    }
    //End: old authentication code
  };

  const handleSubmitSuggestProductsDialog = (productList: Product[]) => {
    const selectedSuggestedProductIdList = productList.map((product) => product.id);

    setSuggestedProductIdList(selectedSuggestedProductIdList);
    setSuggestedProductList(productList);
  };

  const handleDeleteSuggestProduct = async (deletedProduct: Product) => {
    if (!deletedProduct || suggestedProductList.length === 0) return;
    let newSuggestProductIdList = [...suggestedProductIdList];
    newSuggestProductIdList = newSuggestProductIdList.filter((id) => id !== deletedProduct.id);
    setSuggestedProductIdList(newSuggestProductIdList);
    let newSuggestProductList = [...suggestedProductList];
    newSuggestProductList = newSuggestProductList.filter(
      (product) => product.id !== deletedProduct.id
    );
    setSuggestedProductList(newSuggestProductList);
  };

  const handleDeleteAllSuggestedProducts = async () => {
    if (suggestedProductIdList.length === 0 || suggestedProductList.length === 0) return;

    setSuggestedProductIdList([]);
    setSuggestedProductList([]);
  };

  const handleSubmitPrescriptionDialog = (data: Prescription) => {
    if (!data?.name) return;

    const newPrescriptions = [...prescriptions];
    if (!!editPrescription?.name) {
      newPrescriptions[indexPrescription] = data;
      setEditPrescription(null);
      setIndexPrescription(newPrescriptions.length);
    } else {
      newPrescriptions.push(data);
    }

    setPrescriptions(newPrescriptions);
    setOpenPrescriptionsDialog(false);
  };

  const handleDeletePrescription = async (index: number) => {
    if (index < 0 || prescriptions.length === 0) return;

    let newPrescriptions = [...prescriptions];
    newPrescriptions.splice(index, 1);
    setPrescriptions(newPrescriptions);
  };

  const handleDeleteAllPrescription = async () => {
    if (prescriptions.length === 0) return;

    setPrescriptions([]);
  };

  const handleEditPrescriptionClick = (index: number) => {
    if (index < 0 || prescriptions.length === 0) return;

    const editingPrescription = prescriptions[index];
    setEditPrescription(editingPrescription);
    setIndexPrescription(index);
    setOpenPrescriptionsDialog(true);
  };

  // set textarea height based on content
  useEffect(() => {
    if (!commentTextareaRef.current) return;
    commentTextareaRef.current.style.height = "0px"; //set 0px cuz when delete all content, textarea will collapse
    commentTextareaRef.current.style.height = commentTextareaRef.current.scrollHeight - 4 + "px";
  }, [content]);

  useEffect(() => {
    if (!comment || !editCommentId) return;

    setContent(comment.content);
    setImage(comment.image);
    setSuggestedProductIdList(comment.suggestedProductIds);
    setSuggestedProductList(comment.suggestedProducts);
    setPrescriptions(comment.prescriptions);
  }, [comment, editCommentId]);

  useEffect(() => {
    setIndexPrescription(prescriptions.length);
  }, [prescriptions]);

  useEffect(() => {
    if (!emptyContent) setError(false);
  }, [emptyContent]);

  return (
    <div className="mt-4 opacity-100">
      <div
        className={`pb-2 border rounded flex-cols ${
          error
            ? "border-danger hover:border-danger focus-within:border-danger"
            : "border-gray-200 hover:border-primary focus-within:border-primary"
        }`}
      >
        <Form onSubmit={handleSubmit}>
          <textarea
            id={`${questionId}-commentInput`}
            ref={commentTextareaRef}
            rows={1}
            style={{ minHeight: 24, maxHeight: undefined }}
            placeholder="Nhập nội dung..."
            className="w-full p-4 pb-2 text-sm leading-snug border-none rounded-t shadow-none outline-none resize-none lg:text-base no-scrollbar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form>
        {uploading && (
          <div className="w-20 h-20 mt-0.5 mb-1.5 mx-4 rounded bg-gray-100 flex-center">
            <Spinner className="" />
          </div>
        )}
        {!!image && (
          <div className="flex mb-1.5 mt-0.5 mx-4">
            <div className="relative group">
              <Img
                src={image}
                lazyload={false}
                className="w-16 border border-gray-200 rounded-md lg:w-20"
                showImageOnClick
              />
              <i
                onClick={() => setImage(null)}
                data-tooltip="Xóa"
                data-placement="top"
                className="absolute cursor-pointer p-0.5 rounded-full -top-2 -right-2 bg-white lg:hover:bg-danger-dark lg:hover:text-white text-lg text-border-500 border border-slate-300 shadow-xl opacity-100"
              >
                <RiCloseLine />
              </i>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mx-3 lg:gap-10">
          {!image && !uploading && (
            <Button
              textPrimary
              text="Thêm hình ảnh"
              icon={<RiImageAddLine />}
              iconClassName="text-lg"
              className="px-0 text-sm"
              onClick={() => {
                imgRef.current?.click();
              }}
            />
          )}
          <input hidden type="file" accept="image/*" ref={imgRef} onChange={handleImageChange} />
          {!!expertId && (
            <>
              {prescriptions.length === 0 && (
                <Button
                  textPrimary
                  text="Kê toa"
                  icon={<RiMedicineBottleLine />}
                  iconClassName="text-lg"
                  className="px-0 text-sm"
                  onClick={() => setOpenPrescriptionsDialog(true)}
                />
              )}
              {suggestedProductList.length === 0 && (
                <Button
                  textPrimary
                  text="Gợi ý sản phẩm"
                  icon={<RiAddLine />}
                  iconClassName="text-xl"
                  className="px-0 text-sm"
                  onClick={() => setOpenSuggestedProductsDialog(true)}
                />
              )}
            </>
          )}
        </div>
        <div className="gap-3 flex-cols">
          {prescriptions.length > 0 && (
            <div className="mt-1 ml-3 mr-4">
              <QuestionPrescription
                isEdit
                prescriptions={prescriptions}
                onDelete={handleDeletePrescription}
                onDeleteAll={handleDeleteAllPrescription}
                onEditClick={handleEditPrescriptionClick}
              />
              {prescriptions.length < 10 && (
                <Button
                  textPrimary
                  text="Thêm thuốc"
                  icon={<RiAddLine />}
                  iconClassName="text-xl"
                  className="pl-0 text-sm"
                  onClick={() => setOpenPrescriptionsDialog(true)}
                />
              )}
            </div>
          )}
          {suggestedProductList.length > 0 && (
            <div className="mt-1 ml-3 mr-4">
              <QuestionSuggestProducts
                isEdit
                suggestedProductList={suggestedProductList}
                onDelete={handleDeleteSuggestProduct}
                onDeleteAll={handleDeleteAllSuggestedProducts}
              />
              {suggestedProductList.length < 10 && (
                <Button
                  textPrimary
                  text="Thêm sản phẩm"
                  icon={<RiAddLine />}
                  iconClassName="text-xl"
                  className="pl-0 mr-auto text-sm"
                  onClick={() => setOpenSuggestedProductsDialog(true)}
                />
              )}
            </div>
          )}
        </div>
        {error && (
          <div className="mx-4 text-sm font-semibold min-h-6 text-danger">
            <span className="form-error animate-emerge-up">
              Vui lòng nhập ít nhất 1 nội dung bình luận.
            </span>
          </div>
        )}
        <QuestionSuggestProductsDialog
          suggestedProductIdList={suggestedProductIdList}
          suggestedProductList={suggestedProductList}
          isOpen={openSuggestedProductsDialog}
          onClose={() => setOpenSuggestedProductsDialog(false)}
          onSubmit={handleSubmitSuggestProductsDialog}
        />
        <QuestionPrescriptionDialog
          index={indexPrescription}
          isOpen={openPrescriptionsDialog}
          onClose={() => {
            setEditPrescription(null);
            setOpenPrescriptionsDialog(false);
          }}
          onSubmit={handleSubmitPrescriptionDialog}
          editPrescription={editPrescription}
        />
      </div>
      <div className="flex items-center mt-3">
        {editCommentId && (
          <div className="w-auto mr-auto">
            <Button
              text="Hủy chỉnh sửa"
              textDanger
              className="pl-0 font-normal underline"
              onClick={() => onEditCommentIdChange?.(undefined)}
            />
          </div>
        )}

        <div className={`w-auto ml-auto`} ref={submitButtonRef}>
          <Button
            large
            primary
            iconPosition="end"
            iconClassName="text-xl"
            text={`${editCommentId ? "Cập nhật" : "Bình luận"}`}
            className="w-40"
            onClick={() => handleSubmit(userTypeSubmit)}
          />
        </div>
      </div>
    </div>
  );
}
