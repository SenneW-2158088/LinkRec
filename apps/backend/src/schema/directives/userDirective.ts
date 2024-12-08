import { DirectiveLocation, GraphQLDirective, GraphQLNonNull } from "graphql";

export const userDirective: GraphQLDirective  = new GraphQLDirective({
  name: "user",
  description: "Requires the userid to match the data owner's userid to access",
  locations: [
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.OBJECT
  ],
  isRepeatable: false,
})
