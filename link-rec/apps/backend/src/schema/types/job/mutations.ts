import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Validation } from "../../../validation"
import { Job, JobInputType, JobType } from "./types"
import { Role } from "../role/types"

export const createJobMutation: GraphQLFieldConfig<any, any> = {
  type: JobType,
  args: {
    input: { type: new GraphQLNonNull(JobInputType) }
  },
  extensions: { directives: { role: { role: Role.EMPLOYER}, }, },
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
