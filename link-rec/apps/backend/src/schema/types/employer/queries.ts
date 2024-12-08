import { GraphQLFieldConfig, GraphQLID, GraphQLList } from "graphql"
import { Employer, EmployerType } from "./types"
import { ApolloContext } from "../../../apollo_server"

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

export const allEmployerQuery: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLList(EmployerType),
  resolve: async (_source, _args, context, _info) : Promise<Employer[]> => {
    try {
      return await context.api.employerService.all();
    }catch(error) {
      throw context.api.handleError(error)
    }
  }
}
