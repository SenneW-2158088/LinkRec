import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Education, EducationType } from "./types"

export const educationQuery: GraphQLFieldConfig<any, any> = {
  type: EducationType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Education["id"] }, _context, _info) : Promise<Education> => {
    return {
      id: "1",
      institution: "uhasselt",
      degree: "masters"
    }
  }
}

export const EducationQueries = {
  "education": educationQuery
}
