import { Request } from "express";
import { ApolloContext } from "../apollo_server";
import { verify } from "jsonwebtoken";
import { CONFIG } from "../config/config";

export const jwtMiddleware = async (context: ApolloContext, req: Request): Promise<void> => {
  let token = req.headers.authorization
  if(!token) return
  try {
    const { id } = verify(token, CONFIG.JWT_SECRET) as {id: string};
    context.userId = id
  } catch(error) {
    context.userId = null
  }
}
