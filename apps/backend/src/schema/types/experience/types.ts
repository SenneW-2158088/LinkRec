import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export interface Experience {
  title: string,
  company: string,
  startDate?: string
  endDate?: string
  description?: string
}

export const ExperienceType: GraphQLObjectType = new GraphQLObjectType({
  name: "Experience",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    description: { type: GraphQLString },
  })
});
