import mongoose from 'mongoose';

function arrayLimit(val) {
  return val.length <= 3;
}

const reviewSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    helpful: {
      thumbsUp: {
        type: Number,
        default: 0,
      },
      thumbsDown: {
        type: Number,
        default: 0,
      },
    },
    photos: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
