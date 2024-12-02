export * from "./types"

import { GraphQLFieldConfig, GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQueries } from "./types/user/queries";
import { userMutations } from "./types/user/mutations";

export function createRootMutationType(fields: Record<string, GraphQLFieldConfig<any, any>>) {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => fields
  });
}

export function createRootQueryType(fields: Record<string, GraphQLFieldConfig<any, any>>) {
  return new GraphQLObjectType({
    name: 'Query',
    fields: () => fields
  });
}

export const rootQuery = createRootQueryType({
  ...userQueries
})

export const rootMutation = createRootMutationType({
  ...userMutations
})

export const linkRecSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
});
