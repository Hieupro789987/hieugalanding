import React, { useEffect, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { HiArrowUp } from "react-icons/hi";
import { useScreen } from "../../../lib/hooks/useScreen";

type Props = {};

export function BackToTop({ ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const isLg = useScreen("lg");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 1000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className={`fixed ${
            isLg ? `w-14 h-14` : `w-12 h-12`
          } rounded-full shadow-xl cursor-pointer flex-center z-100 bottom-6 lg:right-24 right-5 animate-emerge-up bg-primary hover:bg-primary-dark`}
          onClick={() => scrollToTop()}
        >
          <HiArrowUp className="mr-0 text-2xl font-semibold text-white" />
        </div>
      )}
    </>
  );
}
