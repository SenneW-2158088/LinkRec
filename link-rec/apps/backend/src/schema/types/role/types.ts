import { GraphQLEnumType } from "graphql";

export const RoleType: GraphQLEnumType = new GraphQLEnumType({
  name: "Role",
  description: "User roles",
  values: {
    USER: { value: "USER" },
    EMPLOYER: { value: "EMPLOYER" }
  }
})
