import { DirectiveLocation, GraphQLDirective, GraphQLNonNull } from "graphql";
import { RoleType } from "../types";

export const roleDirective: GraphQLDirective  = new GraphQLDirective({
  name: "auth",
  description: "Validates user authentication",
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    requires: {
      type: new GraphQLNonNull(RoleType),
      description: "Required roles",
    }
  }
})
