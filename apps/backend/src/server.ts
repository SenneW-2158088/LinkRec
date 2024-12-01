import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import { linkRecSchema } from "./schema";

import { Context } from "./types/context";
import { resolvers } from "./schema/resolvers";
import { typeDefs } from "./schema/typeDefs";

const server: ApolloServer<Context> = new ApolloServer({ resolvers, typeDefs });

const PORT = Number(process.env.BACKEND_PORT) || 4000;

async function startServer() {

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
  })

  console.log(`🚀  Server ready at: ${url}`);
}

startServer()