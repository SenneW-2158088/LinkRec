import { GraphQLFieldConfig, GraphQLID, GraphQLList } from "graphql"
import { Job, JobType } from "./types"
import { ApolloContext } from "../../../apollo_server"

export const jobQuery: GraphQLFieldConfig<any, ApolloContext> = {
  type: JobType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Job["id"] }, context, _info) : Promise<Job> => {
    try {
      return await context.api.jobService.get(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const allJobsQuery: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLList(JobType),
  resolve: async (_source, _args, context, _info) : Promise<Job[]> => {
    try {
      return await context.api.jobService.all();
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}
