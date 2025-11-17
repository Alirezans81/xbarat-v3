import bcrypt from "bcryptjs";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { userRepository } from "../repositories/user.repo";
import { addDays } from "date-fns";

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

  getAll: userRepository.getAll,

  getById: userRepository.findById,

  getUserByToken: (token: string) => {
    const decoded = jwtUtils.verify(token);
    if (!decoded) throw new Error("unauthorized");
    return userService.getById(decoded.id);
  },

  getUserByEmail: userRepository.findByEmail,

  checkUserIsAdmin: async (id: string): Promise<boolean> => {
    const user = await userService.getById(id);

    if (user && user.role === "ADMIN") {
      return true;
    }

    return false;
  },

  checkUserIsProvider: async (id: string): Promise<boolean> => {
    const user = await userService.getById(id);

    if (user && user.role === "PROVIDER") {
      return true;
    }

    return false;
  },
};
