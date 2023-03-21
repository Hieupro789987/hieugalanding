import { useCrud } from "../../../../lib/hooks/useCrud";
import { GlobalProductCategoryService } from "../../../../lib/repo/global-product-category.repo";
import { ProductTagService } from "../../../../lib/repo/product-tag.repo";
import { CircleSwiper } from "../../../shared/common/circle-swiper";
import { SectionTitle } from "../../../shared/common/section-title";
import { Spinner } from "../../../shared/utilities/misc";

export function HomeCategoryTag({ ...props }) {
  const productTagCrud = useCrud(GlobalProductCategoryService, {
    limit: 999999,
    order: { priority: -1 },
  });

  if (!productTagCrud.items) return <Spinner />;
  if (!productTagCrud.items.length) return <></>;
  return (
    <div className="mt-5 main-container">
      <SectionTitle>Danh mục sản phẩm</SectionTitle>
      <CircleSwiper
        items={productTagCrud.items.map((x) => ({
          image: x.image,
          name: x.name,
          href: `/products?productTag=${x.id}`,
        }))}
      />
    </div>
  );
}
