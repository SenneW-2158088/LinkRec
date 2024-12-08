import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { User, UserInputType, UserType, UserUpdateType } from "./types";
import { ApolloContext } from "../../../apollo_server";

export const updateUserMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(UserType),
  args: {
    input: { type: new GraphQLNonNull(UserUpdateType) },
  },
  extensions: {
    directives: { user: {} }
  },
  resolve: async (_source, args, context: ApolloContext, info): Promise<User> => {
    try {
      return context.api.userService.updateUser(context.userId!, args.input)
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
};
