import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Employer } from "."

export const employerQuery: GraphQLFieldConfig<any, any> = {
  type: Employer.Employer,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Employer.Type["id"] }, _context, _info) : Promise<Employer.Type> => {
    return {
      id: "1",
      name: "name",
      phoneNumber: "",
      email: "",
      jobs: [],
    }
  }
}
