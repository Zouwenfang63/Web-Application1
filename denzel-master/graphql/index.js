import { GraphQLObjectType, GraphQLSchema } from "graphql";

import mutations from "./mutations";
import queries from "./queries";

//We have 2 category : queries which are used to search informations (about movies or review of a movie)
// and mutations that's allow to modify the database
//Types will create Type for our movies and reviews. 

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations
  })
});
