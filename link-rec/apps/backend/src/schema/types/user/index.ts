import { Education } from "../education";
import { JobSeekingStatus } from "../jobseeking";
import { userQuery } from "./queries";
import { LoginInputType, UserInputType, UserType } from "./types";

export namespace User {

  // Typescript Type representing a user
  export interface Type {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    webPage?: string | null;
    status: JobSeekingStatus.Type,
    location?: string | null;
    bio?: string | null;
    education: Education.Type[]
    connections: User.Type[]
  }

  // Graphql Type representing a user
  export const User = UserType;

  // Graphql Type representing login fields
  export const Login = LoginInputType;

  // Graphql Type representing registration fields
  export const Register = UserInputType;

  // Queries
  export const queries = {
    "user": userQuery,
  }

  // Mutation
  export const mutations = { }
}
