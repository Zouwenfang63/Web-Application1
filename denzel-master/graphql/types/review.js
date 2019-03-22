import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from "graphql";

export const reviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    movieID: { type: GraphQLString },
    comment: { type: GraphQLString },
    date: { type: GraphQLString }
  })
});

export const reviewInputType = new GraphQLInputObjectType({
  name: "ReviewInput",
  fields: () => ({
    movieID: { type: GraphQLString },
    comment: { type: GraphQLString },
    date: { type: GraphQLString }
  })
});
