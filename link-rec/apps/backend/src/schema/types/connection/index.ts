import { acceptConnectionMutation, createConnectionMutation, declineConnectionMutation } from "./mutations";
import { Status as IStatus, Connection as IConnection, ConnectionType } from "./types";

export namespace Connection {

  export const StatusType = IStatus;

  export type Type = IConnection;

  export const Status = StatusType;

  export const Connection = ConnectionType;

  export const queries = {}

  export const mutations = {
    createConnection: createConnectionMutation,
    acceptConnection: acceptConnectionMutation,
    declineConnection: declineConnectionMutation,
  };

}
