// server/src/middleware/authMiddleware.ts

import "dotenv/config";
import { NextFunction } from "express";

import { GetVerificationKey, expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
const audience = process.env.AUTH0_AUDIENCE || "http://localhost:5000/";

export const checkJwt = (_, __, next: NextFunction) => {
  next(
    jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`,
      }) as GetVerificationKey,
      audience: audience,
      issuer: `${issuerBaseUrl}/`,
      algorithms: ["RS256"],
    })
  );
};
