import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Requirement {
  id: string,
  profession: string,
  years: number,
  language: string,
  education: string,
  degree: string,
  description: string,
}

export const requirementType: GraphQLObjectType = new GraphQLObjectType({
  name: "Requirement",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    profession: { type: new GraphQLNonNull(GraphQLString) },
    years: { type: new GraphQLNonNull(GraphQLInt) },
    language: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  }
})

export const requirementInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "RequirementInput",
  fields: {
    profession: { type: new GraphQLNonNull(GraphQLString) },
    years: { type: new GraphQLNonNull(GraphQLInt) },
    language: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  }
})

export const requirementUpdateType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "RequirementUpdate",
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID) },
    profession: { type: GraphQLString },
    years: { type: GraphQLInt },
    language: { type: GraphQLString },
    education: { type: GraphQLString },
    degree: { type: GraphQLString },
    description: { type: GraphQLString },
  }
})
