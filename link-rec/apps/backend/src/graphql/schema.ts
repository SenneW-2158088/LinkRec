import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { AddUserField, QueryUserField } from "./types/user";

export const linkRecSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        user: QueryUserField
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        addUser: AddUserField
      }
    })
  });
