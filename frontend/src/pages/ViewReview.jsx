import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Remove useParams
import { getProductReviewsApi, deleteReviewApi } from "../services/api";
import toast from "react-hot-toast";

const ViewReview = ({ productId }) => {  // ✅ Accept productId as prop
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    if (!productId) return;  // ✅ Guard clause
    
    const fetchReviews = async () => {
      try {
        const res = await getProductReviewsApi(productId);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
        // Don't show error toast - reviews are optional
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleDeleteReview = (reviewId) => {
    setPendingDeleteId(reviewId);
    toast.custom((t) => (
      <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-lg flex gap-3 items-center">
        <span>⚠️ Delete this review?</span>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDelete(reviewId)}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold"
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setPendingDeleteId(null);
            }}
            className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm font-semibold"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const confirmDelete = async (reviewId) => {
    try {
      setDeletingId(reviewId);
      const res = await deleteReviewApi(reviewId);
      if (res.data.success) {
        toast.success("Review deleted successfully!");
        setReviews(reviews.filter(r => r.review_id !== reviewId));
        toast.dismiss();
        setPendingDeleteId(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditReview = (reviewId) => {
    navigate(`/editreview/${reviewId}`);
  };

  if (!productId) return null;  // ✅ Don't render if no productId

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="mt-24 bg-white rounded-[3rem] p-10 shadow-sm border border-pink-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-pink-950 mb-2">
            Verified Reviews
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-2xl">
                {"★".repeat(Math.round(averageRating))}
              </div>
              <span className="font-bold text-pink-900">
                {averageRating} / 5.0
              </span>
              <span className="text-pink-500 text-sm">
                ({reviews.length} Reviews)
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/addreview/${productId}`)}
          className="bg-pink-50 text-pink-700 px-6 py-3 rounded-xl font-bold hover:bg-pink-100 transition"
        >
          Write a Review
        </button>
      </div>

      {loading ? (
        <p className="text-center text-pink-600">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-pink-600 text-lg font-medium">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="p-6 bg-pink-50 border border-pink-100 rounded-2xl hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-pink-900">
                    {review.User?.username || `User #${review.user_id}`}
                  </h4>
                  <span className="text-sm text-pink-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-yellow-400 text-lg flex gap-1">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review.review_id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.review_id)}
                      disabled={deletingId === review.review_id}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm disabled:opacity-50"
                    >
                      {deletingId === review.review_id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-pink-900 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReview;