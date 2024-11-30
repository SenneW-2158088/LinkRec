import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserField } from "./types/user";

export const linkRecSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        user: UserField
      }
    }),
  });
