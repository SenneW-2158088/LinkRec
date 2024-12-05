import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql"
import { User, UserType } from "../user"

export const userQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: User["id"] }, context, _info) : Promise<User> => {
    return await context.api.userService.getUser(args.id);
  }
}

export const userQueries = {
  "user": userQuery
}
