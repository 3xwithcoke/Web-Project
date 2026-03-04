import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductReviewsApi, deleteReviewApi } from "../services/api";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaStar } from "react-icons/fa";

const ViewReview = ({ productId }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!productId) return;
    
    const fetchReviews = async () => {
      try {
        const res = await getProductReviewsApi(productId);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const confirmDelete = async (reviewId) => {
    if(!window.confirm("Purge this testimonial from the archives?")) return;
    try {
      setDeletingId(reviewId);
      const res = await deleteReviewApi(reviewId);
      if (res.data.success) {
        toast.success("Testimonial removed");
        setReviews(reviews.filter(r => r.review_id !== reviewId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove review");
    } finally {
      setDeletingId(null);
    }
  };

  if (!productId) return null;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="mt-40 space-y-16 selection:bg-white selection:text-black">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-8 gap-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-serif font-light tracking-tight italic text-white">
            Client Testimonials
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-6">
              <div className="flex text-white text-xs gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(averageRating) ? "text-white" : "text-gray-800"} />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                {averageRating} Average / {reviews.length} Appraisals
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/addreview/${productId}`)}
          className="bg-white text-black px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-gray-200 transition-all shadow-2xl"
        >
          Submit Appraisal
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 py-20 text-gray-600">
           <div className="w-4 h-4 border-t border-gray-600 rounded-full animate-spin"></div>
           <span className="text-[10px] uppercase tracking-widest">Inquiring Archives...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center border border-gray-900 border-dashed">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-700 italic">No testimonials recorded for this masterpiece</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="group bg-gray-950/20 border border-gray-900 p-10 space-y-6 hover:border-gray-600 transition-all duration-700"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-light text-white uppercase tracking-wide">
                    {review.User?.username || `Member #${review.user_id}`}
                  </h4>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex text-[10px] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-white" : "text-gray-900"} />
                    ))}
                  </div>
                  <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={() => navigate(`/editreview/${review.review_id}`)}
                      className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => confirmDelete(review.review_id)}
                      disabled={deletingId === review.review_id}
                      className="text-[10px] uppercase tracking-widest text-red-900 hover:text-red-600 transition-colors"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 font-light text-sm leading-relaxed italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReview;
