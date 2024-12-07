import { sign, verify, JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { CONFIG } from "../config/config";

type TokenPayload<T> = T & JwtPayload;

export default class JwtService<Payload extends object> {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly jwtSecret: string;

  constructor() {
    // Initialize with configuration values
    this.accessTokenExpiry = CONFIG.ENVIRONMENT === "production" ? "15m" : "7d";
    this.refreshTokenExpiry = "7d";
    this.jwtSecret = CONFIG.JWT_SECRET;
  }

  /**
   * Generates a new pair of access and refresh tokens
   * @param payload The data to be included in the token
   * @returns Object containing access and refresh tokens
   */
  public async generateTokens(payload: Payload): Promise<{ access: string; refresh: string }> {
    // Remove any existing exp claim to prevent conflicts
    const sanitizedPayload = this.sanitizePayload(payload);

    const access = sign(sanitizedPayload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    });

    const refresh = sign(sanitizedPayload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiry,
    });

    return {
      access,
      refresh,
    };
  }

  /**
   * Verifies a JWT token and returns the decoded payload
   * @param token The token to verify
   * @returns Decoded token payload
   * @throws JsonWebTokenError if token is invalid
   */
  public async verify(token: string): Promise<TokenPayload<Payload>> {
    try {
      const decoded = verify(token, this.jwtSecret) as TokenPayload<Payload>;
      return decoded;
    } catch (error) {
      if(error instanceof JsonWebTokenError){
        if (error.name === 'TokenExpiredError') {
          throw new Error('Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
          throw new Error('Invalid token');
        }
      }
      throw error;
    }
  }

  /**
   * Refreshes an existing token pair using a valid refresh token
   * @param refresh The refresh token
   * @returns New pair of access and refresh tokens
   */
  public async refresh(refresh: string): Promise<{ access: string; refresh: string }> {
    try {
      const payload = await this.verify(refresh);
      // Generate new tokens with a clean payload
      return this.generateTokens(this.extractCustomPayload(payload));
    } catch (error) {
      if(error instanceof JsonWebTokenError){
        throw new Error('Unable to refresh tokens: ' + error.message);
      }

      throw error;
    }
  }

  /**
   * Removes JWT-specific claims from payload
   * @param payload The token payload
   * @returns Cleaned payload without JWT claims
   */
  private sanitizePayload(payload: Partial<TokenPayload<Payload>>): Payload {
    // Create a new object without JWT-specific claims
    const { iat, exp, nbf, aud, iss, sub, jti, ...cleanPayload } = payload;
    return cleanPayload as Payload;
  }

  /**
   * Extracts custom payload fields from a full token payload
   * @param payload The full token payload including JWT claims
   * @returns Custom payload fields only
   */
  private extractCustomPayload(payload: TokenPayload<Payload>): Payload {
    return this.sanitizePayload(payload);
  }
}
