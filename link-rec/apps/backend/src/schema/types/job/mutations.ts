import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Validation } from "../../../validation"
import { Job, JobInputType, JobType } from "./types"
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
      await context.api.jobService.create(args.input)
      return {
        id: "1",
        title: "",
        location: "",
        requirements: [],
        active: false
      }
    }catch(error) {
      throw error;
    }
  }
}
