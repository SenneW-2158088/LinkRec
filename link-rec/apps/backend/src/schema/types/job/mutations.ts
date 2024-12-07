import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { GQLTypes } from ".."
import { Validation } from "../../../validation"

export const jobMutation: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.Job.Job,
  args: {
    input: { type: new GraphQLNonNull(GQLTypes.Job.Create) }
  },
  resolve: async (_source, args: { input: Validation.Job.Input }, _context, _info) : Promise<GQLTypes.Job.Type> => {
    return {
      id: "1",
      title: "",
      location: "",
      requirements: [],
      active: false
    }
  }
}
