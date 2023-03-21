import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CrudRepository } from "../repo/crud.repo";

export function useGetOneById<T>(
  id: string,
  crudService: CrudRepository<T>
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(null);

  useEffect(() => {
    if (id) {
      setState(null);
      crudService.getOne({ id }).then(setState);
    } else {
      setState(null);
    }
  }, [id]);

  return [state, setState];
}
