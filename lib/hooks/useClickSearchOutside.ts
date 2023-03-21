import { useState } from "react";
import { useEffect, useRef } from "react";

export function useClickSearchOutside(initialValue = null) {
  const elementRef = useRef(initialValue);
  const [openSearch, setOpenSearch] = useState(false);
  const [value, setValue] = useState<string>();

  const handleMouseDown = () => {
    if (!value) {
      setOpenSearch(false);
      setValue("");
    }
  };
  useEffect(() => {
    function handler(event) {
      if (!elementRef.current?.contains(event.target)) {
        handleMouseDown();
      }
    }
    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, [handleMouseDown]);

  return { openSearch, setOpenSearch, value, setValue, elementRef };
}
