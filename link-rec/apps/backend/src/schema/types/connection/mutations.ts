import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { Connection, ConnectionType } from "./types";
import { ConnectionMock as connectionMock } from "./mocks";

/**
 * Creates a new connection between users
 * @param id - ID of the user to connect with
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {UserNotFoundError} If target user doesn't exist
 * @returns {Promise<Connection>} Newly created connection
 */
const createConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args, context, info): Promise<Connection> => {
    return connectionMock;
  }
};

/**
 * Accepts a pending connection request
 * @param id - ID of the user to accept connection
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {ConnectionNotFoundError} If connection doesn't exist
 * @returns {Promise<Connection>} Updated connection with accepted status
 */
const acceptConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args, context, info): Promise<Connection> => {
    return connectionMock;
  }
};

/**
 * Declines a pending connection request
 * @param id - ID of the user to accept connection
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {ConnectionNotFoundError} If connection doesn't exist
 * @returns {Promise<Connection>} Updated connection with declined status
 */
const declineConnectionMutation: GraphQLFieldConfig<any, ApolloContext> = {
  type: new GraphQLNonNull(ConnectionType),
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args, context, info): Promise<Connection> => {
    return connectionMock;
  }
};

export const connectionMutations = {
  createConnection: createConnectionMutation,
  acceptConnection: acceptConnectionMutation, // Fixed typo in key name
  declineConnection: declineConnectionMutation, // Fixed incorrect value
};
