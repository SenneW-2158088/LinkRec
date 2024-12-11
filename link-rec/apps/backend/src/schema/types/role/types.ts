import { GraphQLEnumType } from "graphql";

export const enum Role {
  USER = 0,
  EMPLOYER = 1,
}

export const RoleType: GraphQLEnumType = new GraphQLEnumType({
  name: "Role",
  description: "User roles",
  values: {
    USER: { value: Role.USER },
    EMPLOYER: { value: Role.EMPLOYER }
  }
})
