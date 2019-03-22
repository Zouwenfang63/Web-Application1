import mongoose from "mongoose";
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    movieID: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true }
  },
  { collection: "reviews", timestamps: true }
);

export default mongoose.model("reviews", reviewSchema);
