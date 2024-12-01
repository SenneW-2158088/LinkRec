import { GraphQLObjectType, GraphQLString, GraphQLFieldResolver, GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLInputObjectType } from "graphql";
import { db } from "../../db/database";
import { userTable } from "../../db/schema";
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

export const QueryUserField: GraphQLFieldConfig<any, any> = {
  type: UserType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_source, args: { id: User["id"] }, _context, _info) => {
    const user = await db.select().from(userTable).where(eq(userTable.id, Number(args.id)))
    return user[0]
  }
}

type UserInput = {
  name: string,
  email: string,
  phoneNumber: string,
  webPage: string,
  location: string,
}

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
  },
});

export const AddUserField: GraphQLFieldConfig<any, any> = {
  type: GraphQLString,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: async (_source, args: { input: UserInput }, _context, _info) => {
    console.log("inserting user:", args)
    await db.insert(userTable).values(args.input)

    return "ok" // todo: return user id or something
  }
}
