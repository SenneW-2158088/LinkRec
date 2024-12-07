import { employerLoginMutation, employerRegisterMutation, userLoginMutation, userRegisterMutation } from "./mutations";
import { UserAuth as IUser, EmployerAuth as IEmployer, EmployerAuthPayloadType, UserAuthPayloadType } from "./types";

export namespace Authentication {

  export type UserType = IUser;

  export type EmployerType = IEmployer;

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
