import { GraphQLDirective, GraphQLFieldConfig, GraphQLObjectType, GraphQLSchema } from "graphql";
import { roleDirective, userDirective } from "./directives";
import { GQLTypes } from "./types";

export function createRootQueryType(fields: Record<string, GraphQLFieldConfig<any, any>>) {
  return new GraphQLObjectType({
    name: 'Query',
    fields: () => fields
  });
}

export function createRootMutationType(fields: Record<string, GraphQLFieldConfig<any, any>>) {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => fields
  });
}

export const rootQuery = createRootQueryType({
  ...GQLTypes.Authentication.queries,
  ...GQLTypes.Connection.queries,
  ...GQLTypes.Education.queries,
  ...GQLTypes.Employer.queries,
  ...GQLTypes.Experience.queries,
  ...GQLTypes.Job.queries,
  ...GQLTypes.Requirement.queries,
  ...GQLTypes.User.queries,
})

export const rootMutation = createRootMutationType({
  ...GQLTypes.Authentication.mutations,
  ...GQLTypes.Connection.mutations,
  ...GQLTypes.Education.mutations,
  ...GQLTypes.Employer.mutations,
  ...GQLTypes.Experience.mutations,
  ...GQLTypes.Job.mutations,
  ...GQLTypes.Requirement.mutations,
  ...GQLTypes.User.mutations,
})

export const linkRecSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
    directives: [
      roleDirective,
      userDirective,
    ]
});
