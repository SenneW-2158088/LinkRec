import { ApolloServer } from "@apollo/server"
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { startStandaloneServer } from '@apollo/server/standalone';
import { UserField } from "./types/user";
import { linkRecSchema } from "./schema";

const server = new ApolloServer({
  schema: linkRecSchema
})

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  console.log(`🚀  Server ready at: ${url}`);
}

startServer()
