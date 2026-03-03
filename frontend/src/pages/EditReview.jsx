import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateReviewApi, getReviewByIdApi } from "../services/api"; 
import toast from "react-hot-toast";

const EditReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await getReviewByIdApi(reviewId); 
        if (res.data.review) {
          setRating(res.data.review.rating);
          setComment(res.data.review.comment);
        }
      } catch (err) {
        toast.error("Unable to load review");
      } finally {
        setFetching(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Review comment cannot be empty");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      setLoading(true);
      const res = await updateReviewApi(reviewId, { rating, comment });

      if (res.data.success) {
        toast.success("Review updated successfully!");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Edit Your Review
        </h2>

        {fetching ? (
          <div className="text-center py-6">
            <p className="text-pink-600">Loading review...</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Rating (1–5)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Review Comment
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
              placeholder="Update your review..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-pink-100 text-pink-600 py-2 rounded hover:bg-pink-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default EditReview;