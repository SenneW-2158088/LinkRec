import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { User, UserType } from "../user"
import { ApolloContext } from "../../../apollo_server";

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
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (source, args: { email: string, password: string }, context: ApolloContext, info): Promise<User> => {
    return await context.api.authenticationService.login(args.email, args.password);
  }
}

export const userQueries = {
  "user": userQuery,
  "login": loginQuery,
}
