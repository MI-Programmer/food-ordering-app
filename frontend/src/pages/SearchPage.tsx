import { useParams } from "react-router-dom";

import Loading from "@/components/Loading";
import { useSearchRestaurant } from "@/api/restaurantApi";
import SearchResultInfo from "@/components/SearchResultInfo";

const SearchPage = () => {
  const { city } = useParams();
  const { results, isLoading } = useSearchRestaurant(city);

  if (isLoading) {
    return <Loading />;
  }

  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_1fr]">
      <div id="cuisines-list">insert cuisines here :)</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchResultInfo total={results.pagination.total} city={city} />
      </div>
    </div>
  );
};

export default SearchPage;
