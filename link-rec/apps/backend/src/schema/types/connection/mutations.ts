import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { Connection, ConnectionType } from "../user/types";

/**
 * Creates a new connection between users
 * @param id - ID of the user to connect with
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {UserNotFoundError} If target user doesn't exist
 * @returns {Promise<Connection>} Newly created connection
 */
export const createConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID },
  },
  extensions: {
    directives: { user: {} }
  },
  resolve: async (_source, args, context: ApolloContext, info): Promise<Connection> => {
    try {
      console.log("executing")
      return context.api.userService.createConnection(context.userId!, args.id)
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
};

/**
 * Accepts a pending connection request
 * @param id - ID of the user to accept connection
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {ConnectionNotFoundError} If connection doesn't exist
 * @returns {Promise<Connection>} Updated connection with accepted status
 */
export const acceptConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args, context: ApolloContext, info): Promise<Connection|null> => {
    // TODO remove null -> also in return type
    return null
  }
};

/**
 * Declines a pending connection request
 * @param id - ID of the user to accept connection
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {ConnectionNotFoundError} If connection doesn't exist
 * @returns {Promise<Connection>} Updated connection with declined status
 */
export const declineConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args, context, info): Promise<Connection|null> => {
    // TODO remove null -> also in return type
    return null;
  }
};
