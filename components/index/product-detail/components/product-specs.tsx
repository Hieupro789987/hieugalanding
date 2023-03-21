import { useScreen } from "../../../../lib/hooks/useScreen";
import { Product } from "../../../../lib/repo/product.repo";
import { SectionTitle } from "../../../shared/common/section-title";

export function ProductSpecs({ product }: { product: Product }) {
  const isLg = useScreen("lg");
  console.log("product: ", product);

  if (!product || !product?.productSpecs || product?.productSpecs?.length <= 0) return <></>;

  return (
    <div className="bg-white rounded-sm  p-5 my-8">
      <SectionTitle className="text-xl lowercase first-letter:uppercase mb-5">
        Thông số sản phẩm
      </SectionTitle>
      <table className="w-full">
        <tbody>
          {product.productSpecs.map((spec, index) => (
            <tr className="flex flex-row" key={spec.id}>
              <td
                className={` lg:w-1/4 w-1/2 lg:p-4 p-2 font-semibold lg:text-sm md:text-sm text-[0.81rem] ${
                  index == 0 && "lg:rounded-t-sm"
                } ${index == product.productSpecs.length - 1 && "lg:rounded-b-sm"}  ${
                  isLg ? "bg-[#F3F4F6]" : index % 2 == 0 && "bg-[#FAFAFA]"
                }`}
              >
                {spec.name}
              </td>
              <td
                className={`w-full lg:p-4 p-2  lg:text-sm md:text-sm text-[0.81rem] ${
                  isLg ? index % 2 != 0 && "bg-[#FAFAFA]" : index % 2 == 0 && "bg-[#FAFAFA]"
                }`}
              >
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
