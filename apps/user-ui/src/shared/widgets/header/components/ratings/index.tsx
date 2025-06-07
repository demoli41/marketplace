import React, { FC } from "react";
import { StarFilled, HalfStar, StarOutline } from "apps/user-ui/src/assets/svgs/half-star";

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<StarFilled key={`star-${i}`} className="w-5 h-5 text-yellow-500" />);
    } else if (i - rating <= 0.5) {
      stars.push(<HalfStar key={`star-${i}`} className="w-5 h-5 text-yellow-500" />);
    } else {
      stars.push(<StarOutline key={`star-${i}`} className="w-5 h-5 text-yellow-500" />);
    }
  }

  return <div className="flex space-x-1">{stars}</div>;
};

export default Ratings;
