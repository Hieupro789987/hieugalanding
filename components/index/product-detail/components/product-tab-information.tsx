import { useEffect, useRef, useState } from "react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Button } from "../../../shared/utilities/form";
import { NotFound } from "../../../shared/utilities/misc";

export function ProductTabInformation({ product }) {
  const [tabIndex, setTabIndex] = useState(0);
  const isLg = useScreen("lg");

  if (!product.productTabs || (product.productTabs.length <= 0 && !product?.intro?.trim()))
    return <></>;
  const productTabs = [
    !!product?.intro ? { tab: { name: "Mô tả" }, content: product?.intro, isActive: true } : {},
    ...product?.productTabs,
  ];

  return (
    <div className="p-5 mb-2 bg-white rounded lg:mb-0">
      <>
        <div
          className="flex flex-row items-center overflow-x-scroll no-scrollbar lg:pb-0 pb-3"
          style={{
            WebkitMaskImage:
              tabIndex + 1 < productTabs.length
                ? "linear-gradient(270deg,transparent .5%,#fff 20%)"
                : "",
          }}
        >
          {productTabs.map(
            (item, index) =>
              item.isActive && (
                <>
                  <TabItemHeading
                    key={index}
                    name={item.tab.name}
                    onChange={() => setTabIndex(index)}
                    index={index}
                    isSelected={tabIndex}
                  />
                  {/* <div className="w-0.5 h-5 bg-accent  rounded sm:hidden last:hidden"></div> */}
                </>
              )
          )}
        </div>
        {!!productTabs[tabIndex].content ? (
          <TabItemContent content={productTabs[tabIndex].content} tabIndex={tabIndex} />
        ) : (
          <NotFound text="Thông tin chưa được cập nhập" />
        )}
      </>
    </div>
  );
}

function TabItemHeading({
  name,
  onChange,
  index,
  isSelected,
}: {
  name: string;
  onChange: () => void;
  index?: number;
  isSelected?: number;
}) {
  const isLg = useScreen("lg");
  return (
    <div
      id={`${name}-${index}`}
      className={`cursor-pointer font-semibold lg:text-lg min-w-fit border-r-2 px-4 first:pl-0 !leading-[1.25] border-r-accent last:border-r-transparent ${
        index == isSelected && "text-primary"
      }`}
      onClick={() => {
        // if (!isLg) {
        const el = document.getElementById(`${name}-${index}`);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        // }

        onChange();
      }}
    >
      <span className="min-w-fit">{name}</span>
    </div>
  );
}

function TabItemContent({ content, tabIndex }) {
  const [more, setMore] = useState(null);
  const textRef = useRef(null);
  const isLg = useScreen("lg");

  useEffect(() => {
    if (!textRef.current?.innerText) return;
    if (textRef.current?.innerText.split(" ").length > 150) {
      setMore("h-80 max-h-80");
    } else {
      setMore(null);
    }
  }, [tabIndex, textRef.current?.innerText]);
  return (
    <div className="relative ease-in duration-300">
      <div
        className={`overflow-hidden lg:text-base text-sm ck-content ${
          more != null ? more : "h-auto"
        }`}
        ref={textRef}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></div>

      {!isLg && more != null && (
        <>
          <div className="flex flex-row items-center justify-center w-full ">
            <Button
              textPrimary
              text={more == "h-auto" ? "Rút gọn" : "Xem thêm"}
              className={`z-20 ${more ? "" : "-mt-1"}`}
              onClick={() => setMore(more == "h-auto" ? "h-80 max-h-80" : "h-auto")}
            />
          </div>
          {more != "h-auto" && (
            <div className="absolute bottom-0 left-0 z-10 w-full h-56 rounded-md lg:h-64 bg-gradient-to-t from-white"></div>
          )}
        </>
      )}
    </div>
  );
}
