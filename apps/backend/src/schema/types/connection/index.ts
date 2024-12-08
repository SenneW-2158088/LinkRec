import { ConnectionType, Status as IStatus, Connection as IConnection } from "../user/types";
import { acceptConnectionMutation, createConnectionMutation, declineConnectionMutation, deleteConnectionMutation } from "./mutations";

export namespace Connection {

  export const StatusType = IStatus;

  export type Type = IConnection;

  export const Status = StatusType;

  export const Connection = ConnectionType;

  export const queries = {}

  export const mutations = {
    createConnection: createConnectionMutation,
    deleteConnection: deleteConnectionMutation,
    acceptConnection: acceptConnectionMutation,
    declineConnection: declineConnectionMutation,
  };

}
