import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Validation } from "../../../validation"
import { Job, JobInputType, JobType } from "./types"

export const jobMutation: GraphQLFieldConfig<any, any> = {
  type: JobType,
  args: {
    input: { type: new GraphQLNonNull(JobInputType) }
  },
  resolve: async (_source, args: { input: Validation.Job.Input }, _context, _info) : Promise<Job> => {
    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
