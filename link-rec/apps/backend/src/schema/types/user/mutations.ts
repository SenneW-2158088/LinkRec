import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { GQLTypes } from "..";
import { Validation } from "../../../validation";

export const loginMutation: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.Authentication.User,
  args: {
    input: { type: new GraphQLNonNull(GQLTypes.User.Login) }
  },
  resolve: async (source, args: { input: Validation.User.Login }, context: ApolloContext, info): Promise<GQLTypes.Authentication.UserType> => {
    try {
      const user = await context.api.authenticationService.user_login(args.input);
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
  type: GQLTypes.User.User,
  args: {
    input: { type: new GraphQLNonNull(GQLTypes.User.Register) }
  },
  resolve: async (_source, args: { input: Validation.User.Register }, context: ApolloContext, _info) : Promise<GQLTypes.Authentication.UserType> => {
    return await context.api.userService.createUser(args.input);
  }
}
