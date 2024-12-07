import { GQLTypes } from "..";
import { JobSeekingStatus } from "../jobseeking";

export const userMock: GQLTypes.User.Type = {
  id: "1",
  firstName: "bugo",
  lastName: "janssen",
  email: "bugo.janssen@hotmail.ru",
  status: JobSeekingStatus.NOT_LOOKING,
  connections: [],
  education: [],
}
