import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export enum ExperienceLevel {
  ENTRY,
  MID,
  SENIOR,
  LEAD,
}

export interface Experience {
  id: string,
  title: string,
  company: string,
  description?: string | null,
  years: number,
  level: ExperienceLevel,
}

export const ExperienceLevelType = new GraphQLEnumType({
  name: "ExperienceLevel",
  values: {
    entry: { value: "ENTRY" },
    mid: { value: "MID" },
    senior: { value: "SENIOR" },
    lead: { value: "LEAD" },
  }
})

export const ExperienceType: GraphQLObjectType = new GraphQLObjectType({
  name: "Experience",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    years: { type: new GraphQLNonNull(GraphQLInt) },
    level: { type: new GraphQLNonNull(ExperienceLevelType) }
  })
});

export const ExperienceInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "ExperienceInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    years: { type: new GraphQLNonNull(GraphQLInt) },
  })
});
