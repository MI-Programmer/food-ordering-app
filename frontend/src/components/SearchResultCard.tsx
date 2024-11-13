import { Link } from "react-router-dom";
import { Clock, Dot } from "lucide-react";

import { AspectRatio } from "./ui/aspect-ratio";
import { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
}

function SearchResultCard({ restaurant }: Props) {
  const { id, imageUrl, cuisines } = restaurant;

  return (
    <Link
      to={`/detail/${id}`}
      className="group grid gap-5 lg:grid-cols-[2fr_3fr]"
    >
      <AspectRatio ratio={16 / 9}>
        <img src={imageUrl} className="w-full rounded-md object-cover" />
      </AspectRatio>

      <div id="card-content" className="grid gap-2 md:grid-cols-2">
        <div className="flex flex-row flex-wrap">
          {cuisines.map((item, index) => (
            <span className="flex" key={index}>
              <span>{item}</span>
              {index < cuisines.length - 1 && <Dot />}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 text-green-600">
            <Clock className="text-green-600" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchResultCard;
