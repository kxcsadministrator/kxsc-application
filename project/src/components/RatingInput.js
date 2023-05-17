import { useState } from "react";
import { FaStar } from "react-icons/fa";

function RatingInput({ maxStars = 5, onRatingChange }) {
  const [rating, setRating] = useState(0);

  const handleStarClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <div className="flex gap-1 items-center">
      {[...Array(maxStars)].map((_, index) => {
        const isFilled = index < rating;

        return (
          <div
            className="border-2 bg-white border-gray-300 md:p-2 rounded-sm "
            key={index}
          >
            <FaStar
              key={index}
              onClick={() => handleStarClick(index)}
              color={isFilled ? "rgb(234 179 8)" : "gray"}
              size={24}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default RatingInput;
