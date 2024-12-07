import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { ApolloContext } from "../../../apollo_server";
import { User, UserType } from "./types";

export const UserQuery: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: User["id"] }, context: ApolloContext, _info) : Promise<User> => {
    try {
      return await context.api.userService.getUser(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}
