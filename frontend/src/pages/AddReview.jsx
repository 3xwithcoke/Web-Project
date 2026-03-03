import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { createReviewApi } from '../services/api';

const AddReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review")
      return;
    }

    try {
      setLoading(true);
      const res = await createReviewApi({
        product_id: productId,
        rating,
        comment,
      })
      if (res.data.success) {
        toast.success("Review submitted successfully!")
        setIsSubmitted(true);
        setTimeout(() => navigate(`/product/${productId}`), 2000);
      }
    } catch (error) {
      console.error("Review error:", error)
      if (error.response?.status === 409) {
        toast.error("You have already reviewed this product")
      } else {
        toast.error(error.response?.data?.message || "Failed to submit review")
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-12 bg-white rounded-[2.5rem] p-12 text-center border border-pink-100 shadow-sm animate-fade-in">
        <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-pink-950">Review Submitted!</h2>
        <p className="text-pink-600 mt-2">Thank you for sharing your glow with the Belleze community.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-[2.5rem] border border-pink-100 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">


        <div className="md:col-span-2 bg-[#FFF0F3] p-10 flex flex-col justify-center border-r border-pink-50">
          <span className="uppercase tracking-[0.2em] text-pink-500 text-xs font-bold mb-4">
            Community Voice
          </span>
          <h2 className="text-4xl font-bold leading-tight text-pink-950">
            Share Your <br /> Experience
          </h2>
          <p className="mt-4 text-pink-800/70 leading-relaxed italic">
            "Your feedback helps us refine our Glow Series and helps other shoppers make the best choice for their skin."
          </p>
          <div className="mt-8 w-12 h-1 border-t-2 border-pink-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-6 bg-white">

          <div className="space-y-3">
            <label className="text-sm font-bold text-pink-950 uppercase tracking-wider">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`w-10 h-10 ${star <= (hover || rating) ? 'fill-yellow-400' : 'fill-pink-50 stroke-pink-100'}`}
                    strokeWidth={1}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-pink-950 uppercase tracking-wider">Your Review</label>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              className="w-full p-5 bg-pink-50/30 border border-pink-100 rounded-3xl focus:ring-2 focus:ring-pink-300 focus:bg-white outline-none transition-all placeholder-pink-300 text-pink-950 shadow-inner"
              placeholder="How does the product feel on your skin? What results did you notice?"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-bold py-5 rounded-[1.5rem] hover:from-pink-600 hover:to-pink-500 shadow-md shadow-pink-100 transition-all transform active:scale-[0.98] uppercase tracking-[0.15em] text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." :"Post My Review"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddReview;