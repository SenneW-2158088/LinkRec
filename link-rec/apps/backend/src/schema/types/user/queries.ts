import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { User, UserType } from "../user"


export const userQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: User["id"] }, _context, _info) : Promise<User> => {
    try {

    }
    catch {

    }
    return {
      id: 0,
      firstName: "Bugo",
      lastName: "Janssen",
      phoneNumber: "12903812903",
      email: "bugo.janssen@hotmail.ru",
      education: [],
      connections: [],
    }
  }
}

export const userQueries = {
  "user": userQuery
}
