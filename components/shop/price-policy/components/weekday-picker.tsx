import { isEqual } from "lodash";
import { useEffect, useState } from "react";

export const WeekdayPicker = ({ ...props }: FormControlProps) => {
  const LABEL_LIST = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const [selectWeekDayList, setSelectWeekDayList] = useState<number[]>([]);

  useEffect(() => {
    if (props.onChange) props.onChange(selectWeekDayList);
  }, [selectWeekDayList]);

  useEffect(() => {
    if (!isEqual(selectWeekDayList, props.value)) {
      setSelectWeekDayList(props.value || []);
    }
  }, [props.value]);

  const handleClick = (weekDay: number) => {
    if (selectWeekDayList.includes(weekDay)) {
      setSelectWeekDayList((prevState) => prevState.filter((item) => item !== weekDay));
    } else {
      setSelectWeekDayList((prevState) => [...prevState, weekDay]);
    }
  };

  return (
    <div className="form-control">
      <div className="flex gap-1 pt-1 pb-0.5">
        {LABEL_LIST.map((label, index) => (
          <div className="flex-1 text-center transition ease-in cursor-pointer group" key={index}>
            <div
              className={`flex items-center justify-center py-2 rounded-full
              ${selectWeekDayList.includes(index) ? "bg-accent" : "group-hover:bg-gray-300"}`}
              onClick={() => handleClick(index)}
            >
              <div
                className={`text-xs font-semibold ${
                  selectWeekDayList.includes(index) ? "text-white" : "text-gray-600"
                }`}
              >
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getWeekdayDefaultValue = () => {
  return [];
};

WeekdayPicker.getDefaultValue = getWeekdayDefaultValue;
