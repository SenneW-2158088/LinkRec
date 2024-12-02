import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { CONFIG } from "./config/config";
import { linkRecSchema } from "./schema";

const server: ApolloServer = new ApolloServer({schema: linkRecSchema });

async function startServer() {

  const { url } = await startStandaloneServer(server, {
    listen: { port: CONFIG.PORT }
  })

  console.log(`🚀 Server ready at: ${url}`);
}

startServer()
