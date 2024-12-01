import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFieldResolver, GraphQLFieldConfig } from "graphql";
import { db } from "../../db/database";
import { userTable } from "../../db/user-table";
import { eq } from "drizzle-orm";

export type User = {
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  webPage: string,
  location: string,
}

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
    // education: { type: new GraphQLList(EducationType) },
    // experience: { type: new GraphQLList(ExperienceType) },
    // connections: { type: new GraphQLList(UserType) },
    // jobSeekingStatus: { type: JobSeekingStatus },
  },
});

export const UserField: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: User["id"] }, _context, _info) => {
    const user = await db.select().from(userTable).where(eq(userTable.id, Number(args.id)))
    return user[0]
  }
}
