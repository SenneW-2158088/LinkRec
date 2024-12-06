import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { AuthPayload, AuthPayloadType, LoginInputType, User, UserInputType, UserType } from "./types";
import { ApolloContext } from "../../../apollo_server";
import { loginInput, UserInput } from "../../../validation/user";

export const loginMutation: GraphQLFieldConfig<any, any> = {
  type: AuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(LoginInputType) }
  },
  resolve: async (source, args: { input: loginInput }, context: ApolloContext, info): Promise<AuthPayload> => {
    try {
      const user = await context.api.authenticationService.login(args.input);
      const tokens = await context.jwt.generateTokens({id: user.id});
      return {
        user: user,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const createUserMutation: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: async (_source, args: { input: UserInput }, context: ApolloContext, _info) : Promise<User> => {
    return await context.api.userService.createUser(args.input);
  }
}

export const userMutations = {
  "login": loginMutation,
  "register": createUserMutation,
}
