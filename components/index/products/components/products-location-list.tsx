import { useRouter } from "next/router";
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";
import { Checkbox } from "../../../shared/utilities/form";
import { useProductsContext } from "../providers/products-provider";

export function ProductsLocationList() {
  const router = useRouter();
  const { provinces, provinceIds } = useProductsContext();

  const toggleProvinceId = (selected: boolean, provinceId: string) => {
    const newProvinceIds = [...provinceIds];

    if (selected) {
      if (!newProvinceIds.includes(provinceId)) {
        newProvinceIds.push(provinceId);
      }
    } else {
      if (newProvinceIds.includes(provinceId)) {
        newProvinceIds.splice(newProvinceIds.indexOf(provinceId), 1);
      }
    }

    const { province, ...query } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...query,
          ...(newProvinceIds.length ? { province: JSON.stringify(newProvinceIds) } : {}),
        },
      },
      null,
      {
        shallow: true,
      }
    );
  };

  if (!provinces) return <></>;
  return (
    <>
      <div className="font-extrabold text-accent text-lg">Nơi bán</div>
      <div className="flex flex-col items-start justify-start gap-2 mb-4 mt-2">
        {provinces.map((province, index) => (
          <Checkbox
            checkedIcon={<IoCheckboxOutline />}
            uncheckedIcon={<IoSquareOutline />}
            key={index}
            className="transform scale-90 lg:scale-100 origin-left"
            controlClassName="form-checkbox text-accent"
            placeholder={province.province}
            value={provinceIds?.includes(province.provinceId)}
            onChange={(val) => {
              toggleProvinceId(val, province.provinceId);
            }}
          />
        ))}
      </div>
    </>
  );
}
