export const DEFAULT_LOGO_IMAGE = "https://i.imgur.com/OcUHUSh.jpg";

export const debounce = async () => {
  await new Promise((res) => {
    setTimeout(res, 2000);
  });
};

export function parseAddressTypePlace(item: any, prefix: string = ""): string {
  if (!item) return "";

  let getPropName = (prop: string) =>
    prefix ? `${prefix}${prop[0].toUpperCase() + prop.slice(1)}` : prop;
  return [
    item[getPropName("street")] || item[getPropName("address")],
    item[getPropName("ward")],
    item[getPropName("district")],
    item[getPropName("province")],
  ]
    .filter(Boolean)
    .join(", ");
}
