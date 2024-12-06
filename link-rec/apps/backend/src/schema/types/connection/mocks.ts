import { userMock } from "../user/mocks";
import { Connection, ConnectionStatus } from "./types";

export const ConnectionMock: Connection = {
  user: userMock,
  status: ConnectionStatus.CONNECTED
}
