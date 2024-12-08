import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

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

export const requirementInputType: GraphQLObjectType = new GraphQLObjectType({
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