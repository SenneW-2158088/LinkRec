import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Validation } from "../../../validation"
import { Job } from "."

export const jobMutation: GraphQLFieldConfig<any, any> = {
  type: Job.Job,
  args: {
    input: { type: new GraphQLNonNull(Job.Create) }
  },
  resolve: async (_source, args: { input: Validation.Job.Input }, _context, _info) : Promise<Job.Type> => {
    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
