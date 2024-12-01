import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { CONFIG } from "./config/config";

const server: ApolloServer<Context> = new ApolloServer({schema: schema });

async function startServer() {

  const { url } = await startStandaloneServer(server, {
    listen: { port: CONFIG.PORT }
  })

  console.log(`🚀 Server ready at: ${url}`);
}

startServer()
