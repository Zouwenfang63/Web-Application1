import movieMutation from "./movie";
import reviewMutation from "./review";

//Two kinds of mutation : mutation on movies and mutations on reviews
export default {
  ...movieMutation,
  ...reviewMutation
};
