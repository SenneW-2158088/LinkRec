import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Job, JobType } from "./types"

export const jobQuery: GraphQLFieldConfig<any, any> = {
  type: JobType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Job["id"] }, _context, _info) : Promise<Job> => {
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

export const jobQueries = {
  "job": jobQuery
}
