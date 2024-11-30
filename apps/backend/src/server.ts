import { ApolloServer } from "@apollo/server"
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { startStandaloneServer } from '@apollo/server/standalone';
import { UserField } from "./types/user";
import { linkRecSchema } from "./schema";
import { env } from "process";

const server = new ApolloServer({
  schema: linkRecSchema
})

const PORT = Number(process.env.BACKEND_PORT)

console.log(PORT)

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
  })

  console.log(`🚀  Server ready at: ${url}`);
}

startServer()
