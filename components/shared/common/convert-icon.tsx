import {
  RiBug2Line,
  RiCopperCoinLine,
  RiFileListLine,
  RiMoneyDollarCircleLine,
  RiPriceTag2Line,
  RiSeedlingLine,
  RiVideoLine,
} from "react-icons/ri";

export function convertIcon(value: string) {
  const ICON_LIST = {
    season: <RiSeedlingLine />,
    bug: <RiBug2Line />,
    material: <RiCopperCoinLine />,
    domesticPrice: <RiPriceTag2Line />,
    exportPrice: <RiMoneyDollarCircleLine />,
    allNews: <RiFileListLine />,
    allVideos: <RiVideoLine />,
  };

  return ICON_LIST[value];
}
