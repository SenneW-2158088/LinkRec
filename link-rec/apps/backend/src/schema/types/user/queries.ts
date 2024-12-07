import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { ApolloContext } from "../../../apollo_server";

export const userQuery: GraphQLFieldConfig<any, any> = {
  type: User.User,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: User.Type["id"] }, context: ApolloContext, _info) : Promise<User.Type> => {
    try {
      return await context.api.userService.getUser(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}
