import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import { linkRecSchema } from "./schema";

import { CONFIG } from "./config/config";

const server: ApolloServer<Context> = new ApolloServer({ resolvers, typeDefs });

async function startServer() {

  const { url } = await startStandaloneServer(server, {
    listen: { port: CONFIG.PORT }
  })

  console.log(`🚀  Server ready at: ${url}`);
}

startServer()
