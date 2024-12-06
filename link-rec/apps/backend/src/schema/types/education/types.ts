import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export enum Degree {
  MASTER,
  BACHELOR,
}

export interface Education {
  id: string;
  institution: string;
  title: string;
  degree: Degree;
}

export const DegreeType: GraphQLEnumType = new GraphQLEnumType({
  name: "Degree",
  values: {
    master: { value: "MASTER" },
    bachelor: { value: "BACHELOR" },
  }
})

export const EducationType: GraphQLObjectType = new GraphQLObjectType({
  name: "Education",
  fields: () => ({
    institution: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(DegreeType) },
  }),
});

export const EducationInputType: GraphQLInputObjectType  = new GraphQLInputObjectType({
  name: "EducationInput",
  fields: () => ({
    institution: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(DegreeType) },
  })
})
