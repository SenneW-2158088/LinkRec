import { sign, verify } from "jsonwebtoken";
import { CONFIG } from "../config/config";

export default class JwtService<Payload extends object> {

  public async generateTokens(payload: Payload): Promise<{access: string, refresh: string}>{

    const token = sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.ENVIRONMENT == "production" ? "15m" : "7d"
    })
    const refresh = sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: "7d",
    })

    return {
      access: token,
      refresh: refresh,
    }
  }

  public async verify(token: string): Promise<Payload> {
    return verify(token, CONFIG.JWT_SECRET) as Payload
  }
}
