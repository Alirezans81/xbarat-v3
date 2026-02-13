import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!; // Define in your `.env`

export const jwtUtils = {
  sign: (payload: object, options = {}) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...options });
  },

  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  },
};
