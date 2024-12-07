import { GraphQLEnumType } from "graphql";

export const enum Role {
  USER,
  EMPLOYER,
}

export const RoleType: GraphQLEnumType = new GraphQLEnumType({
  name: "Role",
  description: "User roles",
  values: {
    USER: { value: Role.USER },
    EMPLOYER: { value: Role.EMPLOYER }
  }
})
