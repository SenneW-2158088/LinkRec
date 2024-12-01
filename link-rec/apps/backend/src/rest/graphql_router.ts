import { ApolloServer } from "@apollo/server";
import express from 'express';

export const graphqlRouter = (apolloServer: ApolloServer) => {
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
      { contextValue: { userId: 'test' }, } // TODO: pass proper contextValuue
    );

    res.json(result.body)
  });
  return  graphqlRouter
}
