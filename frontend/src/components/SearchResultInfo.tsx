import { Link } from "react-router-dom";

interface Props {
  total: number;
  city: string;
}

function SearchResultInfo({ total, city }: Props) {
  return (
    <div className="flex flex-col justify-between gap-3 text-xl font-bold lg:flex-row lg:items-center">
      <span>
        {total} Restaurant found in {city}
        <Link
          to="/"
          className="ml-1 cursor-pointer text-sm font-semibold text-blue-500 underline"
        >
          Change Location
        </Link>
      </span>
      insert sort dropdown here
    </div>
  );
}

export default SearchResultInfo;
