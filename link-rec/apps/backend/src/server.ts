import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { CONFIG } from "./config/config";
import { linkRecSchema } from "./schema";
import { Database, DatabaseConfig } from "./db/database";
import { LinkRecAPI } from "./api";

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'linkrec',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production',
};


const db = new Database(dbConfig);

interface ApolloContext {
  api: LinkRecAPI
}

const server: ApolloServer<ApolloContext> = new ApolloServer({ schema: linkRecSchema });

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: CONFIG.PORT },
    context: async (): Promise<ApolloContext> => ({
      api: new LinkRecAPI({
        db: db
      })
    })
  })

  console.log(`Database Health: ${await db.healthCheck()}`)
  console.log(`🚀 Server ready at: ${url}`);
}

startServer()
