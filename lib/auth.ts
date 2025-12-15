import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface UserToken {
  id: string;
  email: string;
  name?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: UserToken): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string): UserToken | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserToken;
    } catch {
      return null;
    }
  }
}
