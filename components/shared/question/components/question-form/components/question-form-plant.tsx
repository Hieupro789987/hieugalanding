import { useFormContext } from "react-hook-form";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { Plant, PlantService } from "../../../../../../lib/repo/plant.repo";
import { Field, Label, Select } from "../../../../utilities/form";
import { Img, NotFound, Spinner } from "../../../../utilities/misc";

export function QuestionFormPlant({ plants, ...props }: { plants: Plant[] }) {
  const isLg = useScreen("lg");
  const { register, setValue, getValues } = useFormContext();

  register("plantId");

  return (
    <div className="mt-7">
      {plants.length <= 0 ? (
        <NotFound text="Danh sách loại cây trống" />
      ) : (
        <div className="mx-auto animate-emerge-up lg:w-[600px]">
          <div className="mb-4 font-bold text-center lg:text-2xl">
            Chọn loại cây bạn muốn hỏi?
          </div>
          <div className="mx-auto lg:w-96">
            <Field name="plantId">
              <Select
                hasImage
                placeholder="Vui lòng chọn loại cây"
                optionsPromise={() =>
                  PlantService.getAllOptionsPromise({
                    fragment: "id name image",
                    parseOption: (data) => ({
                      label: data.name,
                      value: data.id,
                      image: data.image,
                    }),
                  })
                }
                clearable
                searchable={false}
                onChange={(plantId) => () => setValue("plantId", plantId)}
                className="py-1 pl-1"
              />
            </Field>
          </div>
          <div className="mb-4 text-sm font-bold text-center lg:text-base">
            Một số loại cây gợi ý
          </div>
          <div className="flex flex-wrap justify-center col-span-12 lg:gap-x-4 gap-x-2 gap-y-2 lg:justify-start">
            {plants.length > 0 &&
              plants.slice(0, 8).map((item) => (
                <QuestionChipItem
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.name,
                    image: item.image,
                  }}
                  isSelected={getValues().plantId ? getValues().plantId : ""}
                  onSelected={(plantId) => setValue("plantId", plantId)}
                />
              ))}
            <div className="my-auto">
              (+{[...plants.slice(8, plants.length)].length} loại cây khác)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuestionChipItem({
  item,
  onSelected,
  isSelected,
  ...props
}: {
  item: { id: string; name: string; image: string };
  onSelected?: (id: string) => void;
  isSelected: string;
}) {
  return (
    <div
      className={`p-1 pr-3 text-gray-600 transition border flex flex-row border-gray-200 rounded-sm cursor-pointer hover:bg-primary-light hover:text-primary ${
        isSelected == item.id ? "bg-primary-light text-primary border-primary" : ""
      } `}
      onClick={() => onSelected(item.id)}
    >
      <Img src={item.image} className="w-[26px] h-[26px] mr-1 rounded-sm" lazyload={false}/>
      <span className="block my-auto text-sm lg:text-base">{item.name}</span>
    </div>
  );
}
