import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { User } from "../user";
import { Employer } from "../employer";

export const UserAuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "UserAuthPayload",
  fields: () => ({
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(User.User) },
  })
})

export const EmployerAuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "EmployerAuthPayload",
  fields: () => ({
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(Employer.Employer) },
  })
})
