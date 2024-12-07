import { Employer } from "../employer";
import { User } from "../user";
import { employerLoginMutation, employerRegisterMutation, userLoginMutation, userRegisterMutation } from "./mutations";
import { EmployerAuthPayloadType, UserAuthPayloadType } from "./types";

export namespace Authentication {

  export interface UserType {
    access: string,
    refresh: string,
    user: User.Type,
  };

  export interface EmployerType {
    access: string,
    refresh: string,
    employer: Employer.Type,
  };

  export const User = UserAuthPayloadType;

  export const Employer = EmployerAuthPayloadType;

  export const queries = {};

  export const mutations = {
    "userLogin": userLoginMutation,
    "userRegister": userRegisterMutation,
    "employerLogin": employerLoginMutation,
    "employerRegister": employerRegisterMutation,
  };
}
