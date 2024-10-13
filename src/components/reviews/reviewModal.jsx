import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ReviewModal({ job, onClose, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    console.log('Submitting review:', { rating, comment }); // Pentru debugging
    onSubmitReview(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Review Worker for {job.title}</h3>
        <div className="flex mb-4">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <FaStar
                key={i}
                className="cursor-pointer"
                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                onClick={() => setRating(ratingValue)}
              />
            );
          })}
        </div>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
