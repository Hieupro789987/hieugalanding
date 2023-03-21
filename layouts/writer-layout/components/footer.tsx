import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function Footer({ className = "" }) {
  return (
    <>
      <footer
        className={`w-full p-2 text-sm flex justify-center items-center border-t border-gray-200 mt-auto ${className}`}
      >
        {`GreenAgri v${publicRuntimeConfig.version} © ${new Date().getFullYear()}`}
      </footer>
    </>
  );
}
