import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Job, JobInput, JobInputType, JobType } from "./types"

export const jobMutation: GraphQLFieldConfig<any, any> = {
  type: JobType,
  args: {
    input: { type: new GraphQLNonNull(JobInputType) }
  },
  resolve: async (_source, args: { input: JobInput }, _context, _info) : Promise<Job> => {
    return {
      id: "1",
      title: "",
      employer: "",
      location: "",
      requirements: [],
      isActive: false
    }
  }
}

export const jobMutations = {
  "job": jobMutation,
}
