// src/types/express/index.d.ts
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
