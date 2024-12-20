import { Education } from "../education";
import { JobSeekingStatus } from "../jobseeking";
import { RequestConnectionInputType as RequestConnectionInputType, LoginInputType, UserInputType, UserType } from "./types";
import { AllUserQuery, MatchingJobsQuery, UserQuery } from "./queries";
import { User as IType} from "./types";
import { updateUserMutation } from "./mutations";

export namespace User {

  // Typescript Type representing a user
  export type Type = IType;

  // Graphql Type representing a user
  export const User = UserType;

  // Graphql Type representing login fields
  export const Login = LoginInputType;

  // Graphql Type representing registration fields
  export const Register = UserInputType;

  export const queries = {
    "user": UserQuery,
    "users": AllUserQuery,
    "matchingJobs": MatchingJobsQuery
  }

  export const mutations = {
    "updateUser": updateUserMutation
  }
}
