import { Request } from "express";
import { ApolloContext } from "../apollo_server";
import { verify } from "jsonwebtoken";
import { CONFIG } from "../config/config";
import { Role } from "../schema/types/role/types";

export const jwtMiddleware = async (context: ApolloContext, req: Request): Promise<void> => {
  let token = req.headers.authorization
  if(!token) return
  try {
    const { id, role } = verify(token, CONFIG.JWT_SECRET) as { id: string, role: Role };
    context.userId = id
    context.userRole = role
  } catch(error) {
    context.userId = null
  }
}
