import { Request } from "express";
import { ApolloContext } from "../apollo_server";
import { verify } from "jsonwebtoken";
import { CONFIG } from "../config/config";
import { User } from "../schema/types";

export const jwtMiddleware = async (context: ApolloContext, req: Request): Promise<void> => {
  let token = req.headers.authorization
  if(!token) return
  try {
    const user = verify(token, CONFIG.JWT_SECRET) as User;
    context.user = user
    console.log(user)
  } catch(error) {
    context.user = null
    console.log(`invalid jwt token provided: ${token}`);
  }
}
