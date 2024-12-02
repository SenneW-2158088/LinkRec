import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Employer, EmployerInput, EmployerType } from "./types"
import { EducationInputType } from "../education"

export const employerMutation: GraphQLFieldConfig<any, any> = {
  type: EmployerType,
  args: {
    input: { type: new GraphQLNonNull(EducationInputType) }
  },
  resolve: async (_source, args: { input: EmployerInput }, _context, _info) : Promise<Employer> => {
    return {
      id: "1",
      name: "name",
      phoneNumber: "",
      email: "",
    }
  }
}

export const employerMutations = {
  "employer": employerMutation,
}
