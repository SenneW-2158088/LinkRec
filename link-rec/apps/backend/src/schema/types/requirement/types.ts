import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Requirement {
  id: string,
  profession: string | null,
  years: number | null,
  language: string | null,
  education: string | null,
  degree: string | null,
}

export const requirementType: GraphQLObjectType = new GraphQLObjectType({
  name: "Requirement",
  fields: {
    id: { type: GraphQLID },
    profession: { type: GraphQLString },
    years: { type: GraphQLInt },
    language: { type: GraphQLString },
    education: { type: GraphQLString },
    degree: { type: GraphQLString },
  }
})

export const requirementInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "RequirementInput",
  fields: {
    profession: { type: GraphQLString },
    years: { type: GraphQLInt },
    language: { type: GraphQLString },
    education: { type: GraphQLString },
    degree: { type: GraphQLString },
  }
})

export const requirementUpdateType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "RequirementUpdate",
  fields: {
    profession: { type: GraphQLString },
    years: { type: GraphQLInt },
    language: { type: GraphQLString },
    education: { type: GraphQLString },
    degree: { type: GraphQLString },
  }
})
