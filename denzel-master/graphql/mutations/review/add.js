import { GraphQLString } from "graphql";

import { reviewType } from "../../types/review";
import ReviewModel from "../../../models/review";

export default {
  type: reviewType,
  args: {
    movieID: { name: "movieID", type: GraphQLString },
    comment: { name: "comment", type: GraphQLString }
  },
  resolve(root, params) {
    const rModel = new ReviewModel({
      movieID: params.movieID,
      comment: params.comment,
      date: new Date().toLocaleString()
    });
    const newReview = rModel.save();
    if (!newReview) {
      throw new Error("Error adding review");
    }
    return newReview;
  }
};
