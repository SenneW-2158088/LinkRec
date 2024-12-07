import { JobSeekingStatus } from "../jobseeking";
import { User } from "./types";

export const userMock: User = {
  id: "1",
  firstName: "bugo",
  lastName: "janssen",
  email: "bugo.janssen@hotmail.ru",
  status: JobSeekingStatus.Type.NOT_LOOKING,
  connections: [],
  education: [],
}
