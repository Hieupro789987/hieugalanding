import { omit } from "lodash";
import { useRouter } from "next/router";
import { Category } from "../../../../../../lib/repo/category.repo";
import { Button } from "../../../../../shared/utilities/form";

export function StoreDetailProductsFilter({
  categories,
  productTag,
}: {
  categories: Category[];
  productTag: string;
}) {

  const router = useRouter();
  return (
    <>
      <div className="text-2xl font-semibold text-accent">Danh mục</div>
      <div className="flex flex-col items-start justify-start gap-1 my-8">
        {[{ id: "", name: "Tất cả" }, ...categories]?.map((cate, index) => (
          <Button
            key={cate.id}
            text={cate.name}
            className={`${
              productTag == cate.id || (!cate.id && !productTag)
                ? "text-primary font-semibold"
                : "text-accent"
            } px-1 w-full text-sm lg:text-base font-medium lg:font-medium justify-start`}
            href={{
              pathname: router.pathname,
              query: {
                ...omit(router.query, ["productTag"]),
                ...(cate.id ? { productTag: cate.id } : {}),
              },
            }}
          />
        ))}
      </div>
    </>
  );
}
