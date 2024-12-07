import { GraphQLEnumType, GraphQLNonNull, GraphQLObjectType } from "graphql"
import { GQLTypes } from ".."

export enum ConnectionStatus {
  CONNECTED,
  PENDING,
  RECEIVING
}

export interface Connection {
  user: GQLTypes.User.Type,
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
    user: { type: new GraphQLNonNull(GQLTypes.User.User) },
    status: { type: new GraphQLNonNull(ConnectionStatusType) }
  }
})
