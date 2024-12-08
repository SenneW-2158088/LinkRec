import { GraphQLEnumType, GraphQLNonNull, GraphQLObjectType } from "graphql"
import { User } from "../user"

export enum Status {
  CONNECTED,
  PENDING,
  RECEIVING
};

export interface Connection {
  user: User.Type,
  status: Status,
};

export const ConnectionStatusType = new GraphQLEnumType({
  name: "ConnectionStatus",
  values: {
    CONNECTED: { value: "CONNECTED" },
    PENDING: { value: "PENDING" },
  }
})

export const ConnectionType = new GraphQLObjectType({
  name: "Connection",
  fields: {
    user: { type: new GraphQLNonNull(User.User) },
    status: { type: new GraphQLNonNull(ConnectionStatusType) }
  }
})