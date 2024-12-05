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
    return await context.api.userService.getUser(args.id);
  }
}

export const loginQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(LoginInputType) }
  },
  resolve: async (source, args: { input: loginInput }, context: ApolloContext, info): Promise<User> => {
    return await context.api.authenticationService.login(args.input);
  }
}

export const userQueries = {
  "user": userQuery,
  "login": loginQuery,
}
