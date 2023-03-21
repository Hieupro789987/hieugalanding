export function ServiceDescribe({ description }) {
  if (!description) return <></>;
  return (
    <div className="p-8 mt-4 bg-white rounded shadow-sm lg:my-8">
      <div className="mt-1 text-xl font-extrabold text-primaryBlack">Mô tả</div>
      <div className="text-primaryBlack">
        <div
          className="ck-content"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        ></div>
      </div>
    </div>
  );
}
