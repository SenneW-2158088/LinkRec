import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { User, UserInputType, UserType } from "./types";
import { ApolloContext } from "../../../apollo_server";

export const updateUserMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UserInputType) },
  },
  extensions: {
    directives: { user: {} }
  },
  resolve: async (_source, args, context: ApolloContext, info): Promise<User> => {
    try {
      return context.api.userService.updateUser(args)
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
};
