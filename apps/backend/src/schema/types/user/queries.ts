import { GraphQLFieldConfig, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql"
import { ApolloContext } from "../../../apollo_server";
import { User, UserType } from "./types";
import { Job, JobType } from "../job/types";

export const UserQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: User["id"] }, context: ApolloContext, _info) : Promise<User> => {
    try {
      return context.api.userService.getUser(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const AllUserQuery: GraphQLFieldConfig<any, any> = {
  type: new GraphQLList(UserType),
  resolve: async (_source, _args, context: ApolloContext, _info) : Promise<User[]> => {
    try {
      return context.api.userService.getUsers();
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const MatchingJobsQuery: GraphQLFieldConfig<any, any> = {
  type: new GraphQLList(JobType),
  extensions: { directives: { user: {} } },
  resolve: async (_source, _args, context: ApolloContext, _info) : Promise<Job[]> => {
    try {
      return await context.api.userService.getMatchingJobs(context.userId!);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}
