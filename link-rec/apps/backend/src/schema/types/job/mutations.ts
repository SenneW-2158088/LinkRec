import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql"
import { Validation } from "../../../validation"
import { Job, JobInputType, JobType, JobUpdateType } from "./types"
import { Role } from "../role/types"
import { ApolloContext } from "../../../apollo_server"

export const createJobMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: JobType,
  args: {
    input: { type: new GraphQLNonNull(JobInputType) }
  },
  // extensions: { directives: { role: { role: Role.EMPLOYER}, }, },
  resolve: async (_source, args: { input: Validation.Job.Input }, context, _info) : Promise<Job> => {
    try {
      return await context.api.jobService.create(args.input)
    }catch(error) {
      throw context.api.handleError(error);
    }
  }
}

export const updateJobMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: JobType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(JobUpdateType) }
  },
  // extensions: { directives: { role: { role: Role.EMPLOYER}, }, },
  resolve: async (_source, args: { id: string, input: Validation.Job.Update }, context, _info) : Promise<void> => {
    try {
      await context.api.jobService.update(args.id, args.input)
    }catch(error) {
      context.api.handleError(error);
    }
  }
}
