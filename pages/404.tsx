import { NextSeo } from "next-seo";

export default function Page404() {
  const refresh = () => {
    location.href = location.origin;
  };

  return (
    <>
      <NextSeo title="Không tìm thấy trang" />
      <div className="flex-center text-center flex-col mx-auto max-w-lg px-8 py-40 text-gray-700">
        <img
          alt="question-details-not-found-image"
          className=""
          src="https://i.imgur.com/p4FiZF8.png"
        />
        <h2 className="mb-8 text-xl font-semibold">Không tìm thấy trang.</h2>
        <button className="btn-primary is-large shadow-md h-12" onClick={refresh}>
          Trở về trang chủ
        </button>
      </div>
    </>
  );
}
