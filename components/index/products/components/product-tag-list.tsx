import { omit } from "lodash";
import { useRouter } from "next/router";
import { useDevice } from "../../../../lib/hooks/useDevice";
import { Button, Select } from "../../../shared/utilities/form";
import { SORT_TYPES, useProductsContext } from "../providers/products-provider";

export function ProductsTagList() {
  const router = useRouter();
  const { isMobile } = useDevice();
  const { productTag, productTags, productCategories } = useProductsContext();

  if (!productCategories) return <></>;
  return (
    <>
      <div className="text-lg font-extrabold text-accent">Danh mục</div>
      <div className="flex flex-col items-start justify-start mt-2 mb-4">
        {[
          {
            id: "",
            name: "Tất cả",
          },
          ...productCategories,
        ].map((parent) => (
          <div key={parent?.id}>
            <ButtonCategory id={parent?.id} name={parent?.name} productTag={productTag} />
            <div className="pl-5">
              {parent?.childCategories?.map((tag, index) => (
                <ButtonCategory
                  key={tag.id}
                  id={tag.id}
                  name={tag.name}
                  productTag={productTag}
                  isChild={true}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-3 mb-2 text-lg font-bold">Sắp xếp</div>
        <Select
          native={isMobile}
          defaultValue={"popular"}
          options={SORT_TYPES}
          menuPosition="absolute"
          className="w-full mt-3 rounded-sm lg:border-none"
          value={router.query.sortBy || "popular"}
          onChange={(value) => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                sortBy: value,
              },
            });
          }}
        />
      </div>
    </>
  );
}

export function ButtonCategory({
  id,
  name,
  productTag,
  isChild = false,
  ...props
}: {
  id: string;
  name: string;
  productTag: string;
  isChild?: boolean;
}) {
  const router = useRouter();
  return (
    <Button
      key={id}
      text={name}
      className={`${
        productTag == id || (!id && !productTag) ? "text-primary font-semibold" : "text-accent"
      } px-1 w-full  justify-start ${
        isChild
          ? "lg:text-sm text-xs font-normal lg:font-medium"
          : "text-sm lg:text-base font-medium lg:font-semibold"
      }`}
      href={{
        pathname: router.pathname,
        query: {
          ...omit(router.query, ["productTag"]),
          ...(id ? { productTag: id } : {}),
        },
      }}
    />
  );
}
