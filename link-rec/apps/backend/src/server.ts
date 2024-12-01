import { ApolloServer } from '@apollo/server';
import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import { graphqlRouter } from './rest/graphql-router';
import { createApolloServer } from './graphql/apollo-server';
import 'dotenv/config'

const PORT = Number(process.env.BACKEND_PORT)

const app =  express()

function setupRoutes(apolloServer: ApolloServer) {
    app.use("/user", graphqlRouter(apolloServer))
}

app.listen(PORT, async () => {
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  const apolloServer = createApolloServer()
  await apolloServer.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer)
  )

  setupRoutes(apolloServer)

  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`The GraphQL endpoint is http://localhost:${PORT}/graphql`)
})
