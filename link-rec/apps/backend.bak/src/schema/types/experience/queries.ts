import { GraphQLFieldConfig, GraphQLID } from "graphql"
import { Experience, ExperienceType } from "./types"

export const experienceQuery: GraphQLFieldConfig<any, any> = {
  type: ExperienceType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: Experience["id"] }, _context, _info) : Promise<Experience> => {
    return {
      id: "1",
      title: "",
      company: "",
    }
  }
}

export const experienceQueries = {
  "experience": experienceQuery
}
