import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { User, UserInput, UserInputType, UserType } from "./types";

export const userMutation: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: async (_source, args: { input: UserInput }, _context, _info) : Promise<User> => {
    return {
      id: "99",
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      phoneNumber: args.input.phoneNumber,
      email: args.input.email,
      education: [],
      connections: [],
    }
  }
}

export const userMutations = {
  "user": userMutation,
}
