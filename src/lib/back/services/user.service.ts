import bcrypt from "bcryptjs";
import { jwtUtils } from "@/lib/back/utils/jwt";
import { userRepository } from "../repositories/user.repo";
import { addDays } from "../utils/date";

export const userService = {
  register: async ({
    email,
    password,
    fullName,
    phoneNumber,
    countryCode,
  }: any) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
      email,
      passwordHash: hashedPassword,
      fullName,
      phoneNumber,
      countryCode,
    });

    const token = jwtUtils.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },

  getUserByToken: (token: string) => {
    const decoded = jwtUtils.verify(token);
    if (!decoded) throw new Error("unauthorized");
    return userRepository.findById(decoded.id);
  },

  getUserById: (id: string) => {
    return userRepository.findById(id);
  },

  getAll: userRepository.getAll,

  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("wrongEmailPassword");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("wrongEmailPassword");
    }

    const now = new Date();
    const daysExpiration = 7;
    const tokenExpiration = {
      date: addDays(now, daysExpiration),
      value: `${daysExpiration}d`,
    };

    const token = jwtUtils.sign(
      { id: user.id },
      { expiresIn: tokenExpiration.value }
    );
    return { user, token, token_exp: tokenExpiration.date };
  },

  checkUserIsAdmin: async (id: string): Promise<boolean> => {
    const user = await userRepository.findById(id);

    if (user && user.role === "ADMIN") {
      return true;
    }

    return false;
  },
};
