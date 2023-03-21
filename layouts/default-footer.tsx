import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export function DefaultFooter({ className = "" }) {
  return (
    <>
      <footer
        className={`w-full p-2 text-sm flex justify-center font-semibold items-center ${className}`}
      >
        {`GreenAgri v${publicRuntimeConfig.version} © ${new Date().getFullYear()}`}
      </footer>
    </>
  );
}
