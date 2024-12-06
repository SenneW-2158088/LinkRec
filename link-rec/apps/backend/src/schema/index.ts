import { GraphQLDirective, GraphQLFieldConfig, GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQueries } from "./types/user/queries";
import { userMutations } from "./types/user/mutations";
import { educationMutations } from "./types/education/mutations";
import { educationQueries } from "./types/education/queries";
import { employerMutations, employerQueries, experienceMutations, experienceQueries, jobMutations, jobQueries } from "./types";
import { roleDirective, userDirective } from "./directives";

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
  ...userQueries,
  ...educationQueries,
  ...employerQueries,
  ...experienceQueries,
  ...jobQueries,
})

export const rootMutation = createRootMutationType({
  ...userMutations,
  ...educationMutations,
  ...employerMutations,
  ...experienceMutations,
  ...jobMutations,
})

export const linkRecSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
    directives: [
      roleDirective,
      userDirective,
    ]
});
