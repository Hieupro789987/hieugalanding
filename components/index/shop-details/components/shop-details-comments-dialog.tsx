import cloneDeep from "lodash/cloneDeep";
import { useEffect, useMemo, useState } from "react";
import { FaRegCommentDots, FaStar } from "react-icons/fa";
import ImgsViewer from "react-images-viewer";
import { formatDate } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useDevice } from "../../../../lib/hooks/useDevice";
import { ShopComment, ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import { ShowRating } from "../../../shared/common/show-rating";
import { DialogHeader } from "../../../shared/default-layout/dialog-header";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Spinner, Img, NotFound, Scrollbar } from "../../../shared/utilities/misc";
interface Propstype extends DialogProps {}
export function ShopDetailsCommentsDialog(props: Propstype) {
  const [selectedRating, setSelectedRating] = useState(0);
  const commentCrud = useCrud(
    ShopCommentService,
    {
      order: { createdAt: -1 },
      filter: { status: "PUBLIC", ...(selectedRating ? { rating: selectedRating } : {}) },
    },
    {
      fetchingCondition: props.isOpen,
    }
  );

  const { isMobile } = useDevice();
  return (
    <Dialog bodyClass="relative bg-white rounded" headerClass=" " {...props}>
      <DialogHeader title={`${commentCrud.items?.length} bình luận`} onClose={props.onClose} />
      <Dialog.Body>
        <Scrollbar
          innerClassName={`w-full box-border flex flex-col text-sm sm:text-base `}
          style={{ height: `calc(100vh - 120px)` }}
        >
          <div
            className={`px-4 ${isMobile ? "pb-12" : ""}`}
            style={{
              width: "calc(100% - 16px)",
            }}
          >
            <div className="flex items-center w-full my-3 overflow-x-auto lg:flex-wrap no-scrollbar">
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <div
                  key={value}
                  className={`flex font-bold border-2 rounded-md p-3 whitespace-nowrap mr-4 ${
                    selectedRating == value
                      ? `bg-primary-light text-primary border-primary-light`
                      : `border-gray-100 hover:border-primary hover:text-primary`
                  }`}
                  onClick={(el) => {
                    setSelectedRating(value);
                    el.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }}
                >
                  {value ? (
                    <>
                      <i className="flex items-center text-yellow-300">
                        <FaStar />
                      </i>{" "}
                      <span className="ml-2 font-normal">{value}</span>
                    </>
                  ) : (
                    "Tất Cả Đánh Giá"
                  )}
                </div>
              ))}
            </div>
            {!commentCrud.loading ? (
              <>
                {commentCrud.items?.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {commentCrud.items?.map((item: ShopComment, index) => (
                      <CommentItem comment={item} key={item.id} />
                    ))}
                  </div>
                ) : (
                  <NotFound icon={<FaRegCommentDots />} text="Không tìm thấy bình luận" />
                )}
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </Scrollbar>
      </Dialog.Body>
    </Dialog>
  );
}
function CommentItem({ comment }: { comment?: ShopComment } & ReactProps) {
  const imgs = useMemo(() => {
    if (comment?.images.length) {
      return comment.images.map((item) => ({ src: item }));
    }
    return [];
  }, [comment]);
  const [show, setShow] = useState(false);
  let [cur, setCur] = useState(0);
  return (
    <div className={`w-full`}>
      <div className={`flex items-center leading-7 mt-2 pb-2`}>
        <div className="flex-1">
          <div className="text-base font-bold text-accent">{comment.ownerName}</div>
          <ShowRating className="w-32" rating={comment.rating} />
        </div>
      </div>{" "}
      <div className="font-light text-ellipsis-3">{comment.message}</div>
      <div className="grid grid-cols-4 gap-3 mt-3">
        {comment.images?.map((src) => (
          <Img
            className="col-span-1 border border-gray-100 rounded-md shadow-sm"
            src={src}
            lazyload={false}
            onClick={() => {
              setShow(true);
            }}
            key={comment?.id}
          />
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 md:text-sm">
        {formatDate(comment.createdAt, "dd/MM/yyyy")}
      </div>
      <ImgsViewer
        imgs={imgs}
        width={400}
        currImg={cur}
        preloadNextImg
        spinnnerSize={50}
        isOpen={show}
        onClickPrev={() => {
          if (cur > 0) {
            setCur(--cur);
          }
        }}
        onClickNext={() => {
          if (cur < imgs?.length) {
            setCur(++cur);
          }
        }}
        onClose={() => setShow(false)}
      />
    </div>
  );
}
