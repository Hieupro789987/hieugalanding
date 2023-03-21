import { isEmpty, isEqual } from "lodash";
import { useEffect, useState } from "react";
import { RiAddFill, RiCloseFill } from "react-icons/ri";
import { Button, DatePicker } from "../../../shared/utilities/form";
import { NotFound } from "../../../shared/utilities/misc";

export const TimeFrameOfDayPicker = ({
  hasDefault = false,
  ...props
}: FormControlProps & { hasDefault?: boolean }) => {
  const [timeFrameList, setTimeFrameList] = useState<string[][]>();

  const convertTimeToDate = (time: string) => {
    const splits = time.split(":");
    const date = new Date();
    date.setHours(Number(splits[0]));
    date.setMinutes(Number(splits[1]));
    return date;
  };

  useEffect(() => {
    if (props.onChange) props.onChange(timeFrameList);
  }, [timeFrameList]);

  useEffect(() => {
    if (!isEqual(timeFrameList, props.value)) {
      setTimeFrameList(props.value || []);
    }
  }, [props.value]);

  if (!timeFrameList) return null;

  return (
    <div className="flex flex-col gap-4">
      {timeFrameList.length > 0 ? (
        <div>
          {timeFrameList.map((timeFrame, timeIndex) => (
            <div key={timeFrame.toString() + timeIndex} className="flex items-center mt-2 gap-x-2">
              <div className="w-36">
                <DatePicker
                  timeOnly
                  timeIntervals={30}
                  clearable={false}
                  value={convertTimeToDate(timeFrame[0])}
                  onChange={(date) => {
                    const time =
                      (date as Date).getHours().toString().padStart(2, "0") +
                      ":" +
                      (date as Date).getMinutes().toString().padStart(2, "0");
                    timeFrameList[timeIndex] = [time, timeFrame[1]];
                    if (timeFrameList[timeIndex][0] > timeFrameList[timeIndex][1]) {
                      timeFrameList[timeIndex][1] = timeFrameList[timeIndex][0];
                    }
                    setTimeFrameList([...timeFrameList]);
                  }}
                />
              </div>
              <span>-</span>
              <div className="w-36">
                <DatePicker
                  timeOnly
                  timeIntervals={30}
                  clearable={false}
                  value={convertTimeToDate(timeFrame[1])}
                  onChange={(date) => {
                    const time =
                      (date as Date).getHours().toString().padStart(2, "0") +
                      ":" +
                      (date as Date).getMinutes().toString().padStart(2, "0");
                    timeFrameList[timeIndex] = [timeFrame[0], time];
                    setTimeFrameList([...timeFrameList]);
                  }}
                  maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
                  minTime={
                    new Date(
                      new Date().setHours(
                        new Date(convertTimeToDate(timeFrame[0])).getHours(),
                        new Date(convertTimeToDate(timeFrame[0])).getMinutes(),
                        0,
                        0
                      )
                    )
                  }
                />
              </div>
              <Button
                className={`px-2 ${timeIndex == 0 ? "opacity-0 pointer-events-none" : ""}`}
                hoverDanger
                icon={<RiCloseFill />}
                onClick={() => {
                  if (timeIndex == 0) return;
                  timeFrameList.splice(timeIndex, 1);
                  setTimeFrameList([...timeFrameList]);
                }}
              />
            </div>
          ))}
          <Button
            className="px-0 my-2"
            textPrimary
            icon={<RiAddFill />}
            text="Thêm khung giờ"
            onClick={() => {
              timeFrameList.push(["00:00", "00:00"]);
              setTimeFrameList([...timeFrameList]);
            }}
          />
        </div>
      ) : (
        <Button
          className="justify-start px-0"
          textPrimary
          icon={<RiAddFill />}
          text="Thêm khung giờ"
          onClick={() => {
            timeFrameList.push(["00:00", "00:00"]);
            setTimeFrameList([...timeFrameList]);
          }}
        />
      )}
    </div>
  );
};

const getTimeFrameDefaultValue = () => {
  return [];
};

TimeFrameOfDayPicker.getDefaultValue = getTimeFrameDefaultValue;
