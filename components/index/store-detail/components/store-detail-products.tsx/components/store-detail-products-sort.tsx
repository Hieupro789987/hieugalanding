import { useRouter } from "next/router";
import { useDevice } from "../../../../../../lib/hooks/useDevice";
import { Select } from "../../../../../shared/utilities/form";
import { SORT_TYPES } from "../../../../products/providers/products-provider";

export function StoreDetailProductsSort() {
  const router = useRouter();
  const {isMobile} = useDevice();
  return (
    <>
      <div className="mt-3 mb-2 text-lg font-bold">Sắp xếp</div>
      <Select
        native={isMobile}
        defaultValue={"new"}
        options={SORT_TYPES}
        className="w-full mt-3 rounded-sm lg:border-none"
        value={router.query.sortBy || "new"}
        onChange={(value) => {
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              sortBy: value,
            },
          });
        }}
      />
    </>
  );
}
