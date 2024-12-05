import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { User, UserInput, UserInputType, UserType } from "./types";
import { ApolloContext } from "../../../apollo_server";

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
  "createUser": createUserMutation,
}
