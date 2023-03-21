import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Area, AreaService } from "../../../../lib/repo/area.repo";

export function useGetSelectedNewsArea() {
  const areaQuery = useQuery("area");
  const [selectedArea, setSelectedArea] = useState<Area>();

  const getSelectedArea = async () => {
    if (!areaQuery) return;

    try {
      const res = await AreaService.getAll({
        query: { filter: { slug: areaQuery } },
      });
      setSelectedArea(res.data[0]);
    } catch (error) {
      console.debug(error);
    }
  };

  useEffect(() => {
    getSelectedArea();
  }, [areaQuery]);

  return selectedArea;
}
