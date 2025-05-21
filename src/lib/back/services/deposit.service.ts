import { Deposit } from "@/generated/prisma";
import { depositRepository } from "../repositories/deposit.repo";

export const depositService = {
  getAll: () => {
    return depositRepository.getAll();
  },

  create: (data: {
    userId: string;
    amount: number;
    walletId: string;
    paymentChannelId: string;
  }) => {
    return depositRepository.create(data);
  },

  getUserDeposits: (userId: string) => {
    return depositRepository.findByUserId(userId);
  },

  userOwnsDeposit: async (userId: string, depositId: string) => {
    try {
      const foundDeposit = await depositRepository.findById(depositId);

      if (!foundDeposit) return false;

      if (foundDeposit.userId === userId) return true;
      return false;
    } catch (error) {
      console.error("[USER_OWNS_DEPOSIT]", error);
    }
  },

  updateById: (
    id: string,
    newValue: {
      userId: string;
      amount: number;
      walletId: string;
      paymentChannelId: string;
    }
  ): Promise<Deposit> => {
    return depositRepository.updateById(id, newValue);
  },

  deleteById: (id: string) => {
    return depositRepository.deleteById(id);
  },
};
