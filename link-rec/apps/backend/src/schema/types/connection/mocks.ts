import { userMock } from "../user/mocks";
import { Connection, Status } from "./types";

export const ConnectionMock: Connection = {
  user: userMock,
  status: Status.CONNECTED
}
