import { GraphQLEnumType, GraphQLNonNull, GraphQLObjectType } from "graphql"
import { User, UserType } from "../user"

export enum ConnectionStatus {
  CONNECTED,
  PENDING,
  RECEIVING
}

export interface Connection {
  user: User,
  status: ConnectionStatus
}

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
    user: { type: new GraphQLNonNull(UserType) },
    status: { type: new GraphQLNonNull(ConnectionStatusType) }
  }
})
