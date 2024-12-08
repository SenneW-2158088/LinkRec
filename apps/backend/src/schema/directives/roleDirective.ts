import { DirectiveLocation, GraphQLDirective } from "graphql";
import { RoleType } from "../types/role/types";

export const roleDirective: GraphQLDirective  = new GraphQLDirective({
  name: "role",
  description: "Requires the user to have the correct role",
  args: {
    role: { type: RoleType }
  },
  locations: [
    DirectiveLocation.MUTATION,
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.OBJECT,
  ],
  isRepeatable: false,
})
