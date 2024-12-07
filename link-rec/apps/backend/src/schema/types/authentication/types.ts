import { GraphQLInputObjectType, GraphQLInputType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Employer, EmployerType } from "../employer/types";
import { User, UserType } from "../user/types";

export interface UserAuth {
  access: string,
  refresh: string,
  user: User,
};

export interface EmployerAuth {
  access: string,
  refresh: string,
  employer: Employer,
};

export const UserAuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "UserAuthPayload",
  fields: {
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  }
})

export const EmployerAuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "EmployerAuthPayload",
  fields: {
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(EmployerType) },
  }
})
