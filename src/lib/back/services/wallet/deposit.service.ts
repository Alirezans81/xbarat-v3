import { depositRepository } from "../../repositories/wallet/deposit.repo";

export const depositService = {
  create: depositRepository.create,

  getAll: depositRepository.getAll,

  getById: depositRepository.findById,

  updateById: depositRepository.updateById,

  deleteById: depositRepository.deleteById,

  userOwnsTheDeposit: async (userId: string, depositId: string) => {
    try {
      const foundDeposit = await depositService.getById(depositId);

      if (!foundDeposit) return false;

      if (foundDeposit.userId === userId) return true;
      return false;
    } catch (error) {
      console.error("[USER_OWNS_DEPOSIT]", error);
    }
  },
};
