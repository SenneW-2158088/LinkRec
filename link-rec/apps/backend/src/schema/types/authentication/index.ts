import { GQLTypes } from "..";
import { EmployerAuthPayloadType, UserAuthPayloadType } from "./types";

export namespace Authentication {

  export interface UserType {
    access: string,
    refresh: string,
    user: GQLTypes.User.Type,
  };

  export interface EmployerType {
    access: string,
    refresh: string,
    employer: GQLTypes.User.Type,
  };

  export const User = UserAuthPayloadType;

  export const Employer = EmployerAuthPayloadType;

  export const queries = {};

  export const mutations = {};
}
