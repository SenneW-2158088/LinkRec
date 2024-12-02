import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export interface Experience {
  id: string,
  title: string,
  company: string,
  startDate?: string
  endDate?: string
  description?: string
}

export const ExperienceType: GraphQLObjectType = new GraphQLObjectType({
  name: "Experience",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    description: { type: GraphQLString },
  })
});

export interface ExperienceInput {
  title: string,
  company: string,
  startDate?: string
  endDate?: string
  description?: string
}

export const ExperienceInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "Experience",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    description: { type: GraphQLString },
  })
});
