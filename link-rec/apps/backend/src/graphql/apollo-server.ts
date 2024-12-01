import { ApolloServer } from "@apollo/server"
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { startStandaloneServer } from '@apollo/server/standalone';
import { QueryUserField } from "./types/user";
import { linkRecSchema } from "./schema";
import { env } from "process";

export const createApolloServer = () => {
  return new ApolloServer({
    schema: linkRecSchema
  })
}
