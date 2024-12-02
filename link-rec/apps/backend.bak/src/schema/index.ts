export * from "./types"

import { GraphQLObjectType, GraphQLSchema } from "graphql";

export const linkRecSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
      }
    })
  });
