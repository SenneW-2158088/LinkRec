import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { LoginInputType, UserInputType, UserType} from "../user/types";
import { Validation } from "../../../validation";
import { ApolloContext } from "../../../apollo_server";
import { EmployerAuth, EmployerAuthPayloadType, UserAuth, UserAuthPayloadType } from "./types";
import { EmployerInputType, EmployerLoginInputType } from "../employer/types";

export const userLoginMutation: GraphQLFieldConfig<any, any> = {
  type: UserAuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(LoginInputType) }
  },
  resolve: async (source, args: { input: Validation.User.Login }, context: ApolloContext, info): Promise<UserAuth> => {
    try {
      const user = await context.api.authenticationService.user_login(args.input);
      const tokens = await context.jwt.generateTokens({id: user.id});
      return {
        user: user,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const userRegisterMutation: GraphQLFieldConfig<any, any> = {
  type: UserAuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: async (_source, args: { input: Validation.User.Register }, context: ApolloContext, _info) : Promise<UserAuth> => {
    return await context.api.userService.createUser(args.input);
  }
}

export const employerLoginMutation: GraphQLFieldConfig<any, any> = {
  type: EmployerAuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(EmployerLoginInputType) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Login }, context: ApolloContext, _info) : Promise<EmployerAuth> => {
    try {
      const employer = await context.api.authenticationService.employer_login(args.input);
      const tokens = await context.jwt.generateTokens({id: employer.id});
      return {
        employer: employer,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
}

export const employerRegisterMutation: GraphQLFieldConfig<any, any> = {
  type: EmployerAuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(EmployerInputType) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Register }, context: ApolloContext, _info) : Promise<EmployerAuth> => {
    try {
      const employer = await context.api.employerService.create_employer(args.input);
      const tokens = await context.jwt.generateTokens({id: employer.id});
      return {
        employer: employer,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
}
