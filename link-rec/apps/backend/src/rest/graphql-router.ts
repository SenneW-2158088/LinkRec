import { ApolloServer } from "@apollo/server";
import express from 'express';
import { ApolloContext } from "../apollo_server";

export const graphqlRouter = (apolloServer: ApolloServer<ApolloContext>) => {
  const graphqlRouter = express.Router();
  graphqlRouter.get('/:id', async (req, res) => {
    const userId = req.params.id;

    const query = `
        query {
            user(id: ${userId}) {
                id
                name
                email
            }
        }
    `;

    const result = await apolloServer.executeOperation(
      { query },
    );

    res.json(result.body)
  });
  return  graphqlRouter
}
