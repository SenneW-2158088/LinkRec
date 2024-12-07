import { GQLTypes } from "..";
import { Education } from "../education";
import { JobSeekingStatus } from "../jobseeking";
import { createUserMutation, loginMutation } from "./mutations";
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
    status: JobSeekingStatus,
    location?: string | null;
    bio?: string | null;
    education: GQLTypes.Education.Type[]
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
  export const mutations = {
    "userLogin": loginMutation,
    "userRegister": createUserMutation,
  }
}
