import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { GQLTypes } from ".."

export const employerQuery: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.Employer.Employer,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: GQLTypes.Employer.Type["id"] }, _context, _info) : Promise<GQLTypes.Employer.Type> => {
    return {
      id: "1",
      name: "name",
      phoneNumber: "",
      email: "",
      jobs: [],
    }
  }
}
