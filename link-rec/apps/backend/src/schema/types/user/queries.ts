import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { LoginInputType, User, UserType } from "../user"
import { ApolloContext } from "../../../apollo_server";
import { loginInput } from "../../../validation/user";

export const userQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: User["id"] }, context: ApolloContext, _info) : Promise<User|null> => {
    try {
      return await context.api.userService.getUser(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const userQueries = {
  "user": userQuery,
}
