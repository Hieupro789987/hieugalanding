import { useEffect, useState } from "react";

export function useCheckEditQuest(totalComments: number) {
  const [canEditQuest, setCanEditQuest] = useState(false);

  useEffect(() => {
    totalComments > 0 ? setCanEditQuest(false) : setCanEditQuest(true);
  }, [totalComments]);

  return canEditQuest;
}
