import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { GQLTypes } from ".."

export const jobQuery: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.Job.Job,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: GQLTypes.Job.Type["id"] }, _context, _info) : Promise<GQLTypes.Job.Type> => {
    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
