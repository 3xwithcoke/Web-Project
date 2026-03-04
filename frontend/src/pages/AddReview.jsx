import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { createReviewApi } from '../services/api';
import { FaStar } from "react-icons/fa";

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
      toast.error("Please provide an appraisal rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please provide a written testimonial")
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
        toast.success("Appraisal submitted successfully")
        setIsSubmitted(true);
        setTimeout(() => navigate(`/product/${productId}`), 2000);
      }
    } catch (error) {
      console.error("Review error:", error)
      if (error.response?.status === 409) {
        toast.error("You have already recorded an appraisal for this masterpiece")
      } else {
        toast.error(error.response?.data?.message || "Failed to submit appraisal")
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-white selection:text-black">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 border border-white flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-light tracking-tight italic text-white">Appraisal Recorded</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Thank you for your contribution to the Chronos Luxe archives.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-24 px-6">
      <div className="max-w-5xl mx-auto border border-gray-900 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
        <div className="md:col-span-2 bg-gray-950 p-12 flex flex-col justify-center space-y-8 border-b md:border-b-0 md:border-r border-gray-900">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-600">Archive Entry</p>
          <h2 className="text-4xl font-serif font-light leading-tight italic text-white">
            Share Your <br /> Appraisal
          </h2>
          <p className="text-gray-500 font-light text-sm leading-relaxed italic">
            "Your feedback ensures the continued excellence of our curated collection and assists fellow collectors in their pursuit of horological perfection."
          </p>
          <div className="w-12 h-[1px] bg-gray-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 p-12 space-y-12 bg-black">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Acquisition Quality</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-300"
                >
                  <FaStar 
                    size={24}
                    className={`${star <= (hover || rating) ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Detailed Testimonial</label>
            <textarea
              required
              rows="5"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              className="w-full bg-transparent border-b border-gray-900 py-4 text-sm font-light focus:border-white outline-none transition-all placeholder:text-gray-800 resize-none"
              placeholder="Describe the craftsmanship, accuracy, and aesthetic experience..."
            ></textarea>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-5 text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-gray-200 transition-all shadow-2xl disabled:opacity-20"
            >
              {loading ? "Authenticating..." : "Commit Appraisal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
