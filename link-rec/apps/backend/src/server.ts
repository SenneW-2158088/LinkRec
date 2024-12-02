import express from 'express'
import { graphqlRouter } from './rest/graphql-router'
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server'
import { ApolloContext, createApolloContext, createApolloServer } from './apollo_server'
import { CONFIG } from "./config/config";
import { createContext } from 'vm';

const app = express()

function setupRoutes(apolloServer: ApolloServer<ApolloContext>) {
    app.use("/user", graphqlRouter(apolloServer))
}

app.listen(CONFIG.PORT, async () => {
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  const apolloServer = createApolloServer()
  await apolloServer.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer, createApolloContext())
  )

  setupRoutes(apolloServer)

  console.log(`😳 Server is running on http://localhost:${CONFIG.PORT}`)
  console.log(`💀 The GraphQL endpoint is http://localhost:${CONFIG.PORT}/graphql`)
  console.log(`🍆 Enjoy...`)
})
