const Review = require("../models/reviewModel");
const User = require("../models/userModel");

const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const userId = req.user.id;

    if (!product_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product ID and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const existingReview = await Review.findOne({
      where: {
        product_id,
        user_id: userId
      }
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    const newReview = await Review.create({
      product_id,
      user_id: userId,
      rating,
      comment: comment || null
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: newReview
    });

  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required"
      });
    }

    const review = await Review.findOne({
      where: { review_id: reviewId, user_id: userId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (review.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review"
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // if (reviews.length === 0) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "No reviews yet for this product",
    //     reviews: [],
    //   });
    // }

    return res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error("Fetch reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required"
      });
    }

    const review = await Review.findOne({
      where: { review_id: reviewId },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error("Get review error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching review"
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const review = await Review.findOne({
      where: { review_id: id, user_id: userId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized"
      });
    }

    await review.update({ rating, comment });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review
    });

  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  deleteReview,
  updateReview

};
