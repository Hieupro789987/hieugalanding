import { useMemo } from "react";
import { RiBugLine, RiCollageLine, RiDatabaseLine, RiFileChartLine, RiPlantLine } from "react-icons/ri";

export function QuestionChip({
  type = "plant",
  title = "",
}: ReactProps & { type: string; title: string }) {
  const textColor = useMemo(() => {
    if (type === "plant") {
      return "text-primary";
    }

    // if (type === "disease") {
    //   return "text-danger";
    // }

    if (type === "topic") {
      return "text-orange"
    }

    if (type === "area") {
      return "text-amber-700";
    }

    if (type === "quantity") {
      return "text-cyan-700";
    }
  }, [type]);

  const icon = useMemo(() => {
    if (type === "plant") {
      return <RiPlantLine />;
    }

    // if (type === "disease") {
    //   return <RiBugLine />;
    // }
    if (type === "topic") {
      return <RiFileChartLine />;
    }

    if (type === "area") {
      return <RiCollageLine />;
    }

    if (type === "quantity") {
      return <RiDatabaseLine />;
    }
  }, [type]);

  return (
    <div className={`lg:py-2 rounded text-sm font-medium items-center flex gap-1 ${textColor}`}>
      <i className="text-sm">{icon}</i>
      <div className="">{title}</div>
    </div>
  );
}
