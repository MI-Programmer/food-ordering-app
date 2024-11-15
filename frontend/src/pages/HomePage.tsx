import { useNavigate } from "react-router-dom";

import SearchBar, { SearchForm } from "@/components/SearchBar";

function HomePage() {
  const navigate = useNavigate();

  const handleSubmit = (searchFormValue: SearchForm) => {
    navigate(`/search/${searchFormValue.searchQuery}`);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="-mt-16 flex flex-col gap-5 rounded-lg bg-white py-8 text-center shadow-md md:px-32">
        <h1 className="text-5xl font-bold tracking-tight text-orange-600">
          Tuck into a takeway today
        </h1>

        <span className="text-xl">Food is just a click away!</span>

        <SearchBar
          placeHolder="Search by City or Town"
          onSubmit={handleSubmit}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <img src="images/landing.png" />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="text-3xl font-bold tracking-tighter">
            Order takeaway even faster!
          </span>

          <span>
            Download the Food Ordering App for faster ordering and personalised
            recommendations
          </span>

          <img src="images/appDownload.png" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
