import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { User, UserInput, UserInputType, UserType } from "./types";

export const userMutation: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: async (_source, args: { input: UserInput }, context, _info) : Promise<User> => {
    return await context.api.userService.createUser();
  }
}

export const userMutations = {
  "user": userMutation,
}
