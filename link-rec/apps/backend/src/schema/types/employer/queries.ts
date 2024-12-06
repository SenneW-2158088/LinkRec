import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Employer, EmployerType } from "./types"

export const employerQuery: GraphQLFieldConfig<any, any> = {
  type: EmployerType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Employer["id"] }, _context, _info) : Promise<Employer> => {
    return {
      id: "1",
      name: "name",
      phoneNumber: "",
      email: "",
      jobs: [],
    }
  }
}

export const employerQueries = {
  "employer": employerQuery
}
