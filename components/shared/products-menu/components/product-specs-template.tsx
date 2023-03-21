import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { FaAsterisk } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";
import { SpecsTemplate } from "../../../../lib/repo/specs-template.repo";
import { Input } from "../../utilities/form";
import KhongDau from "khong-dau";
import { Spinner } from "../../utilities/misc";
import { useProductsContext } from "../providers/products-provider";

export function ProductSpecsTemplate({
  onSpecProductSelect,
}: {
  onSpecProductSelect: (val: any) => void;
}) {
  const { loadSpecsTemplate, specsTemplate } = useProductsContext();

  const [searchText, setSearchText] = useState("");

  const [filteredSpecsTemplate, setFilteredSpecsTemplate] = useState<SpecsTemplate[]>();

  useEffect(() => {
    if (specsTemplate) {
      setFilteredSpecsTemplate(
        specsTemplate.filter((topping) => {
          if (searchText) {
            return KhongDau(topping.name).includes(KhongDau(searchText));
          } else {
            return true;
          }
        })
      );
    }
  }, [specsTemplate, searchText]);
  useEffect(() => {
    loadSpecsTemplate();
  }, []);

  return (
    <div className="p-5 overflow-hidden bg-white rounded">
      {!specsTemplate ? (
        <Spinner />
      ) : (
        <>
          <div className="font-semibold">Chọn mẫu thông số sản phẩm</div>
          <Input
            className="my-5 no-focus "
            placeholder="Tìm kiếm mẫu thông số sản phẩm"
            prefix={<RiSearch2Line />}
            clearable
            value={searchText}
            onChange={setSearchText}
          />
          <Scrollbars className="p-3" autoHeightMax={500} style={{ height: "500px" }}>
            <div className=" v-scrollbar">
              {filteredSpecsTemplate?.map((spec, index) => (
                <div
                  className={`border border-gray-300 hover:border-primary hover:bg-primary-light transition-colors duration-150 shadow-sm rounded mb-2 p-3 cursor-pointer`}
                  key={spec.id}
                  onClick={() => onSpecProductSelect(spec)}
                >
                  <div className="flex font-semibold text-gray-800">{spec.name}</div>
                  <div className="text-gray-600">
                    {spec.specs.map((option) => option.name).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </Scrollbars>
        </>
      )}
    </div>
  );
}
