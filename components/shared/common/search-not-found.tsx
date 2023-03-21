export function SearchNotFound({ type = "sản phẩm", ...props }: { type?: string }) {
  return (
    <div className="w-full mx-auto mb-12 text-center lg:mb-0">
      <img srcSet="/assets/img/NotFound.png 2x" alt="notfound" className="mx-auto" />
      <div className="mb-2 text-xl font-bold">Không tìm thấy kết quả nào</div>
      <div className="text-sm font-medium">{`Hãy thử chọn các ${type} khác`}</div>
    </div>
  );
}
