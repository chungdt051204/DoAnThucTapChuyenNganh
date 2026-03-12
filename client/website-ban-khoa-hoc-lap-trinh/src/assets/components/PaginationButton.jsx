import { useSearchParams, Link } from "react-router-dom";
export default function PaginationButton({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const createUrl = (page) => {
    if (page > 1) params.set("page", page);
    else {
      params.delete("page");
    }
    return params.toString();
  };
  const pages = [...Array(totalPages)]?.map((_, i) => {
    return i + 1;
  });
  const currentPage = searchParams.get("page") || 1;
  if (totalPages <= 1) return null;
  return (
    <>
      <div>
        <Link to={`?${createUrl(Number(currentPage) - 1)}`}>
          <button disabled={currentPage == 1}>Trang trước</button>
        </Link>
        {pages?.map((value, index) => {
          return (
            <Link key={index} to={`?${createUrl(value)}`}>
              <button>{value}</button>
            </Link>
          );
        })}
        <Link to={`?${createUrl(Number(currentPage) + 1)}`}>
          <button disabled={currentPage == pages?.length}>Trang sau</button>
        </Link>
      </div>
    </>
  );
}
