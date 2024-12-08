import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Job, JobType } from "./types"
import { ApolloContext } from "../../../apollo_server"

export const jobQuery: GraphQLFieldConfig<any, ApolloContext> = {
  type: JobType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Job["id"] }, context, _info) : Promise<Job> => {

    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
