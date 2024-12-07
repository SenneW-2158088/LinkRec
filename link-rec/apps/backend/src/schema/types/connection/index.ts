import { GQLTypes } from "..";
import { acceptConnectionMutation, createConnectionMutation, declineConnectionMutation } from "./mutations";
import { ConnectionType } from "./types";

export namespace Connection {

  export enum StatusType {
    CONNECTED,
    PENDING,
    RECEIVING
  };

  export interface Type {
    user: GQLTypes.User.Type,
    status: StatusType,
  };

  export const Status = StatusType;

  export const Connection = ConnectionType;

  export const queries = {}

  export const mutations = {
    createConnection: createConnectionMutation,
    acceptConnection: acceptConnectionMutation,
    declineConnection: declineConnectionMutation,
  };

}
