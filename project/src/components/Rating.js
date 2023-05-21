import { FaStar, FaRegStar } from "react-icons/fa";

function Rating({ rating }) {
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const emptyStars = maxRating - fullStars;

  return (
    <div className="flex gap-1 text-yellow-500 items-center ">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} />
      ))}
      <p className="md:text-sm text-xs mt-[13px] text-gray-500">({rating}/5)</p>
    </div>
  );
}

export default Rating;
