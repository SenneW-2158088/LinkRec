import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { ApolloContext } from "../../../apollo_server";
import { GQLTypes } from "..";

export const userQuery: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.User.User,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_source, args: { id: GQLTypes.User.Type["id"] }, context: ApolloContext, _info) : Promise<GQLTypes.User.Type> => {
    try {
      return await context.api.userService.getUser(args.id);
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}
