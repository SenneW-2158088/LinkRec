import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export interface Experience {
  id: string,
  title: string,
  company: string
  description?: string | null,
  years: number,
}

export enum Level {
  ENTRY,
  MID,
  SENIOR,
  LEAD,
}

export const ExperienceLevelType = new GraphQLEnumType({
  name: "ExperienceLevel",
  values: {
    entry: { value: Level.ENTRY },
    mid: { value: Level.MID },
    senior: { value: Level.SENIOR },
    lead: { value: Level.LEAD },
  }
})

export const ExperienceType: GraphQLObjectType = new GraphQLObjectType({
  name: "Experience",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    profession: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    years: { type: new GraphQLNonNull(GraphQLInt) },
  })
});

export const ExperienceInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "ExperienceInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    profession: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    years: { type: new GraphQLNonNull(GraphQLInt) },
  })
});
export type ExperienceInput = {
  title: string,
  company: string,
  description: string | null,
  years: number
}

export const ExperienceUpdateType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "ExperienceUpdate",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    profession: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    years: { type: new GraphQLNonNull(GraphQLInt) },
  })
});

export type ExperienceUpdate = {
  title: string,
  profession: string,
  company: string,
  description: string | null,
  years: number
}
