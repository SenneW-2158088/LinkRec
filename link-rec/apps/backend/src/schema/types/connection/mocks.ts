import { Connection } from ".";
import { userMock } from "../user/mocks";

export const ConnectionMock: Connection.Type = {
  user: userMock,
  status: Connection.StatusType.CONNECTED
}
