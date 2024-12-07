import { GQLTypes } from "..";
import { userMock } from "../user/mocks";

export const ConnectionMock: GQLTypes.Connection.Type = {
  user: userMock,
  status: GQLTypes.Connection.StatusType.CONNECTED
}
