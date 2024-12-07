import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Job } from "."

export const jobQuery: GraphQLFieldConfig<any, any> = {
  type: Job.Job,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Job.Type["id"] }, _context, _info) : Promise<Job.Type> => {
    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
